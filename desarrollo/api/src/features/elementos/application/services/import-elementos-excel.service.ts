import * as XLSX from 'xlsx';

import { ValidationError } from '../../../../core/errors/app-error';
import { MunicipioRepository } from '../../../municipios/domain/repositories/municipio-repository';
import { ProvinciaRepository } from '../../../provincias/domain/repositories/provincia-repository';
import { ProveedorRepository } from '../../../proveedores/domain/repositories/proveedor-repository';
import { SectorRepository } from '../../../sectores/domain/repositories/sector-repository';
import {
  CreateElementoInput,
  ElementoRepository,
} from '../../domain/repositories/elemento-repository';

export interface ImportElementosExcelResult {
  importedCount: number;
  skippedCount: number;
  duplicates: string[];
}

const normalizeText = (value: unknown): string => {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const normalizeKey = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

const hasAlphabeticCharacter = (value: string): boolean => /[a-z]/i.test(value);

const findRowValue = (
  row: Record<string, unknown>,
  candidates: string[],
  options?: { allowContains?: boolean },
): string => {
  const allowContains = options?.allowContains ?? false;

  for (const key of Object.keys(row)) {
    const normalizedKey = normalizeKey(key);
    const matchesColumn = candidates.some((candidate) => {
      const normalizedCandidate = normalizeKey(candidate);

      if (normalizedKey === normalizedCandidate) {
        return true;
      }

      if (!allowContains) {
        return false;
      }

      return (
        normalizedKey.includes(normalizedCandidate) ||
        normalizedCandidate.includes(normalizedKey)
      );
    });

    if (matchesColumn) {
      const value = row[key];
      return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
    }
  }

  return '';
};

const parseInteger = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const numeric = Number(String(value).trim());
  if (!Number.isInteger(numeric) || numeric <= 0) {
    return null;
  }

  return numeric;
};

const parseDecimal = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const raw = String(value).trim();
  if (!raw) {
    return null;
  }

  const normalized = raw.replace(/\s+/g, '');
  const sign = normalized.startsWith('-') ? -1 : 1;
  const unsigned = normalized.replace(/^[-+]/, '');

  let normalizedNumber = unsigned;

  if (unsigned.includes('.') && unsigned.includes(',')) {
    const decimalSeparator = unsigned.lastIndexOf('.') > unsigned.lastIndexOf(',') ? '.' : ',';
    const thousandSeparator = decimalSeparator === '.' ? ',' : '.';
    normalizedNumber = unsigned.replaceAll(thousandSeparator, '').replace(decimalSeparator, '.');
  } else if (unsigned.includes(',')) {
    const commaParts = unsigned.split(',');

    if (commaParts.length > 2) {
      normalizedNumber = commaParts.join('');
    } else if (commaParts[1] && commaParts[1].length <= 4) {
      normalizedNumber = `${commaParts[0]}.${commaParts[1]}`;
    } else {
      normalizedNumber = unsigned.replace(/,/g, '');
    }
  }

  const numeric = Number(normalizedNumber) * sign;
  if (!Number.isFinite(numeric)) {
    return null;
  }

  if (Math.abs(numeric) >= 1000000 && Math.abs(numeric) < 1000000000) {
    return Number((numeric / 10000000).toFixed(7));
  }

  return numeric;
};

const parseDateValue = (value: unknown): Date | null => {
  if (!value) {
    return null;
  }

  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
};

const normalizeCompare = (value: string): string => normalizeText(value).toLowerCase();

export class ImportElementosExcelService {
  constructor(
    private readonly elementos: ElementoRepository,
    private readonly proveedores: ProveedorRepository,
    private readonly provincias: ProvinciaRepository,
    private readonly municipios: MunicipioRepository,
    private readonly sectores: SectorRepository,
  ) {}

  async execute(
    buffer: Buffer,
    fileName: string,
    idUsuarioRegistra: number,
  ): Promise<ImportElementosExcelResult> {
    if (!buffer || buffer.length === 0) {
      throw new ValidationError('El archivo Excel esta vacio');
    }

    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new ValidationError('El archivo Excel no tiene hojas');
    }

    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: '',
      raw: false,
    });

    if (!rows.length) {
      throw new ValidationError('El archivo Excel no tiene filas para importar');
    }

    const proveedores = (await this.proveedores.findMany()).map((item) => item.toPrimitives());
    const tiposElementos = await this.elementos.findTiposElementosCatalogo();
    const formatos = await this.elementos.findFormatosCatalogo();
    const tamanos = await this.elementos.findDimensionesCatalogo();
    const orientaciones = await this.elementos.findOrientacionesCatalogo();

    const proveedorByName = new Map(proveedores.map((item) => [normalizeCompare(item.proveedor), item.idProveedor]));
    const tipoByName = new Map(tiposElementos.map((item) => [normalizeCompare(item.nombre), item.id]));
    const formatoByName = new Map(formatos.map((item) => [normalizeCompare(item.nombre), item.id]));
    const tamanoByName = new Map(tamanos.map((item) => [normalizeCompare(item.nombre), item.id]));
    const orientacionByName = new Map(
      orientaciones.map((item) => [normalizeCompare(item.nombre), item.id]),
    );

    let importedCount = 0;
    let skippedCount = 0;
    const duplicates: string[] = [];

    for (const row of rows) {
      const idProveedorRaw = findRowValue(row, ['idproveedor']);
      const proveedorName = normalizeText(
        findRowValue(row, ['proveedor', 'suplidor', 'nombreproveedor']),
      );

      let idProveedor = parseInteger(idProveedorRaw);
      if (!idProveedor && proveedorName) {
        idProveedor = proveedorByName.get(normalizeCompare(proveedorName)) ?? null;
      }

      const idTipoElementoRaw = findRowValue(row, ['idtipoelemento']);
      const tipoElementoName = normalizeText(
        findRowValue(row, ['tipoelemento', 'tipo', 'nombretipoelemento']),
      );

      let idTipoElemento = parseInteger(idTipoElementoRaw);
      if (!idTipoElemento && tipoElementoName) {
        idTipoElemento = tipoByName.get(normalizeCompare(tipoElementoName)) ?? null;
      }

      if (!idProveedor || !idTipoElemento) {
        skippedCount += 1;
        continue;
      }

      const licencia = normalizeText(findRowValue(row, ['licencia'])) || null;
      const idSeguimiento = normalizeText(findRowValue(row, ['idseguimiento', 'seguimiento'])) || null;

      if (!licencia && !idSeguimiento) {
        skippedCount += 1;
        continue;
      }

      const existing = await this.elementos.findMany({ includeAnulados: true, termino: licencia ?? idSeguimiento ?? undefined });
      const duplicate = existing.some((item) => {
        const sameLicencia = licencia && item.licencia && normalizeCompare(item.licencia) === normalizeCompare(licencia);
        const sameSeguimiento =
          idSeguimiento &&
          item.idSeguimiento &&
          normalizeCompare(item.idSeguimiento) === normalizeCompare(idSeguimiento);

        return Boolean(sameLicencia || sameSeguimiento);
      });

      if (duplicate) {
        skippedCount += 1;
        duplicates.push(licencia || idSeguimiento || 'Elemento duplicado');
        continue;
      }

      const idFormatoRaw = findRowValue(row, ['idformato']);
      const formatoName = normalizeText(findRowValue(row, ['formato', 'tipoformato']));
      let idFormato = parseInteger(idFormatoRaw);
      if (!idFormato && formatoName) {
        idFormato = formatoByName.get(normalizeCompare(formatoName)) ?? null;
      }

      const idTamanoRaw = findRowValue(row, ['idtamano', 'iddimension']);
      const tamanoName = normalizeText(findRowValue(row, ['tamano', 'dimension', 'tamaño']));
      let idTamano = parseInteger(idTamanoRaw);
      if (!idTamano && tamanoName) {
        idTamano = tamanoByName.get(normalizeCompare(tamanoName)) ?? null;
      }

      const idOrientacionRaw = findRowValue(row, ['idorientacion']);
      const orientacionName = normalizeText(findRowValue(row, ['orientacion']));
      let idOrientacion = parseInteger(idOrientacionRaw);
      if (!idOrientacion && orientacionName) {
        idOrientacion = orientacionByName.get(normalizeCompare(orientacionName)) ?? null;
      }

      const idProvinciaRaw = findRowValue(row, ['idprovincia']);
      const provinciaName = normalizeText(findRowValue(row, ['provincia']));
      let idProvincia = parseInteger(idProvinciaRaw);
      if (!idProvincia && provinciaName) {
        const provincia = await this.provincias.findByNombre(provinciaName);
        idProvincia = provincia ? provincia.toPrimitives().idProvincia : null;
      }

      const idMunicipioRaw = findRowValue(row, ['idmunicipio']);
      const municipioName = normalizeText(findRowValue(row, ['municipio']));
      let idMunicipio = parseInteger(idMunicipioRaw);
      if (!idMunicipio && municipioName) {
        const municipios = await this.municipios.findMany();
        const candidatos = municipios
          .map((item) => item.toPrimitives())
          .filter((item) => {
            if (normalizeCompare(item.municipio) !== normalizeCompare(municipioName)) {
              return false;
            }

            if (!idProvincia) {
              return true;
            }

            return item.idProvincia === idProvincia;
          });

        if (candidatos.length === 1) {
          idMunicipio = candidatos[0].idMunicipio;
        }
      }

      const idSectorBarrioRaw = findRowValue(row, ['idsectorbarrio', 'idsector']);
      const sectorName = normalizeText(findRowValue(row, ['sectorbarrio', 'sector', 'barrio']));
      let idSectorBarrio = parseInteger(idSectorBarrioRaw);
      if (!idSectorBarrio && sectorName && idMunicipio) {
        const sector = await this.sectores.findByNombreInMunicipio(idMunicipio, sectorName);
        idSectorBarrio = sector ? sector.toPrimitives().idSectorBarrio : null;
      }

      const input: CreateElementoInput = {
        idProveedor,
        licencia,
        fechaEmision: parseDateValue(findRowValue(row, ['fechaemision'])),
        fechaVencimiento: parseDateValue(findRowValue(row, ['fechavencimiento'])),
        idSeguimiento,
        idTipoElemento,
        idFormato,
        idTamano,
        activo: true,
        costoAlquiler: parseDecimal(findRowValue(row, ['costoalquiler', 'costo'])),
        direccion: normalizeText(findRowValue(row, ['direccion'])) || null,
        idOrientacion,
        idProvincia,
        idMunicipio,
        idSectorBarrio,
        circunscripcion: normalizeText(findRowValue(row, ['circunscripcion'])) || null,
        latitud: parseDecimal(findRowValue(row, ['latitud', 'latitude'], { allowContains: true })),
        longitud: parseDecimal(findRowValue(row, ['longitud', 'longitude'], { allowContains: true })),
        idUsuarioRegistra,
      };

      await this.elementos.create(input);
      importedCount += 1;
    }

    if (importedCount === 0 && skippedCount === 0) {
      throw new ValidationError(`No se encontraron elementos validos en el archivo ${fileName}`);
    }

    return {
      importedCount,
      skippedCount,
      duplicates,
    };
  }
}