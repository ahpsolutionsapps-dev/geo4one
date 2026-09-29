import * as XLSX from 'xlsx';

import { ValidationError } from '../../../../core/errors/app-error';
import { MunicipioRepository } from '../../../municipios/domain/repositories/municipio-repository';
import { ProvinciaRepository } from '../../../provincias/domain/repositories/provincia-repository';
import { SectorRepository } from '../../../sectores/domain/repositories/sector-repository';
import { ProveedorRepository } from '../../domain/repositories/proveedor-repository';
import { CreateProveedorUseCase } from '../use-cases/create-proveedor.use-case';

export interface ImportProveedoresExcelResult {
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

const normalizeCompare = (value: string): string => normalizeText(value).toLowerCase();

export class ImportProveedoresExcelService {
  constructor(
    private readonly proveedores: ProveedorRepository,
    private readonly provincias: ProvinciaRepository,
    private readonly municipios: MunicipioRepository,
    private readonly sectores: SectorRepository,
  ) {}

  async execute(
    buffer: Buffer,
    fileName: string,
    creadoPor: number,
  ): Promise<ImportProveedoresExcelResult> {
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

    const createProveedor = new CreateProveedorUseCase(
      this.proveedores,
      this.provincias,
      this.municipios,
      this.sectores,
    );

    const existingProveedores = await this.proveedores.findMany();
    const existingNames = new Set(
      existingProveedores.map((item) => normalizeCompare(item.toPrimitives().proveedor)),
    );

    let importedCount = 0;
    let skippedCount = 0;
    const duplicates: string[] = [];

    for (const row of rows) {
      const proveedorName = normalizeText(
        findRowValue(row, ['proveedor', 'suplidor', 'nombreproveedor', 'nombresuplidor', 'nombre']),
      );

      if (!proveedorName || !hasAlphabeticCharacter(proveedorName)) {
        skippedCount += 1;
        continue;
      }

      const proveedorKey = normalizeCompare(proveedorName);
      if (existingNames.has(proveedorKey)) {
        skippedCount += 1;
        duplicates.push(proveedorName);
        continue;
      }

      const rnc = normalizeText(findRowValue(row, ['rnc'])) || null;
      if (rnc) {
        const existingByRnc = await this.proveedores.findByRnc(rnc);
        if (existingByRnc) {
          skippedCount += 1;
          duplicates.push(`${proveedorName} (RNC duplicado)`);
          continue;
        }
      }

      const idProvinciaRaw = findRowValue(row, ['idprovincia']);
      const provinciaName = normalizeText(
        findRowValue(row, ['provincia', 'nombreprovincia', 'provincia_name']),
      );
      let idProvincia = parseInteger(idProvinciaRaw);
      if (!idProvincia && provinciaName) {
        const provincia = await this.provincias.findByNombre(provinciaName);
        idProvincia = provincia ? provincia.toPrimitives().idProvincia : null;
      }

      const idMunicipioRaw = findRowValue(row, ['idmunicipio']);
      const municipioName = normalizeText(
        findRowValue(row, ['municipio', 'nombremunicipio', 'municipio_name']),
      );
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
      const sectorName = normalizeText(
        findRowValue(row, ['sectorbarrio', 'sector', 'barrio', 'nombresector']),
      );
      let idSectorBarrio = parseInteger(idSectorBarrioRaw);
      if (!idSectorBarrio && sectorName && idMunicipio) {
        const sector = await this.sectores.findByNombreInMunicipio(idMunicipio, sectorName);
        idSectorBarrio = sector ? sector.toPrimitives().idSectorBarrio : null;
      }

      await createProveedor.execute({
        proveedor: proveedorName,
        rnc,
        personaContacto:
          normalizeText(findRowValue(row, ['personacontacto', 'contacto', 'responsable'])) || null,
        cargo: normalizeText(findRowValue(row, ['cargo'])) || null,
        email: normalizeText(findRowValue(row, ['email', 'correo'])) || null,
        paginaWeb: normalizeText(findRowValue(row, ['paginaweb', 'web', 'sitio'])) || null,
        direccion: normalizeText(findRowValue(row, ['direccion', 'direccionfiscal'])) || null,
        idProvincia,
        idMunicipio,
        idSectorBarrio,
        creadoPor,
      });

      existingNames.add(proveedorKey);
      importedCount += 1;
    }

    if (importedCount === 0 && skippedCount === 0) {
      throw new ValidationError(`No se encontraron suplidores validos en el archivo ${fileName}`);
    }

    return {
      importedCount,
      skippedCount,
      duplicates,
    };
  }
}