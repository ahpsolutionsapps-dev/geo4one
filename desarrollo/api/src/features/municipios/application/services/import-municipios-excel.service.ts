import * as XLSX from 'xlsx';

import { ValidationError } from '../../../../core/errors/app-error';
import { ProvinciaRepository } from '../../../provincias/domain/repositories/provincia-repository';
import { MunicipioRepository } from '../../domain/repositories/municipio-repository';
import { CreateMunicipioUseCase } from '../use-cases/create-municipio.use-case';

export interface ImportMunicipiosExcelResult {
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

const parseInteger = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const normalized = String(value).trim();
  if (!normalized) {
    return null;
  }

  const numeric = Number(normalized);
  if (!Number.isInteger(numeric) || numeric <= 0) {
    return null;
  }

  return numeric;
};

export class ImportMunicipiosExcelService {
  constructor(
    private readonly municipios: MunicipioRepository,
    private readonly provincias: ProvinciaRepository,
  ) {}

  async execute(
    buffer: Buffer,
    fileName: string,
    creadoPor: number,
  ): Promise<ImportMunicipiosExcelResult> {
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

    const createMunicipio = new CreateMunicipioUseCase(this.municipios, this.provincias);
    let importedCount = 0;
    let skippedCount = 0;
    const duplicates: string[] = [];

    for (const row of rows) {
      const municipioName = normalizeText(
        findRowValue(row, ['municipio', 'nombremunicipio', 'municipio_name', 'nombre']),
      );

      if (!municipioName || !hasAlphabeticCharacter(municipioName)) {
        skippedCount += 1;
        continue;
      }

      const idProvinciaRaw = findRowValue(row, ['idprovincia']);
      const provinciaName = normalizeText(
        findRowValue(row, ['provincia', 'nombreprovincia', 'provincia_name']),
      );

      let idProvincia = parseInteger(idProvinciaRaw);

      if (!idProvincia && provinciaName) {
        const province = await this.provincias.findByNombre(provinciaName);
        idProvincia = province ? province.toPrimitives().idProvincia : null;
      }

      if (!idProvincia) {
        skippedCount += 1;
        continue;
      }

      const existing = await this.municipios.findByNombreInProvincia(idProvincia, municipioName);
      if (existing) {
        skippedCount += 1;
        duplicates.push(`${municipioName} (${existing.toPrimitives().provinciaNombre})`);
        continue;
      }

      const latitud = parseDecimal(
        findRowValue(row, ['latitud', 'latitude', 'lat'], { allowContains: true }),
      );
      const longitud = parseDecimal(
        findRowValue(row, ['longitud', 'longitude', 'lng', 'lon'], { allowContains: true }),
      );

      await createMunicipio.execute({
        idProvincia,
        municipio: municipioName,
        latitud,
        longitud,
        creadoPor,
      });

      importedCount += 1;
    }

    if (importedCount === 0 && skippedCount === 0) {
      throw new ValidationError(`No se encontraron municipios validos en el archivo ${fileName}`);
    }

    return {
      importedCount,
      skippedCount,
      duplicates,
    };
  }
}