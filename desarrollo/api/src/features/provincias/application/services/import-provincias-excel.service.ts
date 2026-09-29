import * as XLSX from 'xlsx';

import { ValidationError } from '../../../../core/errors/app-error';
import { ProvinciaRepository } from '../../domain/repositories/provincia-repository';
import { CreateProvinciaUseCase } from '../use-cases/create-provincia.use-case';

export interface ImportProvinciasExcelResult {
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

  const hasAlphabeticCharacter = (value: string): boolean => /[a-z]/i.test(value);

const normalizeKey = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

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

export class ImportProvinciasExcelService {
  constructor(private readonly provincias: ProvinciaRepository) {}

  async execute(
    buffer: Buffer,
    fileName: string,
    creadoPor: number,
  ): Promise<ImportProvinciasExcelResult> {
    if (!buffer || buffer.length === 0) {
      throw new ValidationError('El archivo Excel está vacío');
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

    const createProvincia = new CreateProvinciaUseCase(this.provincias);
    let importedCount = 0;
    let skippedCount = 0;
    const duplicates: string[] = [];

    for (const [index, row] of rows.entries()) {
      const provinciaName = normalizeText(
        findRowValue(row, ['provincia', 'nombre', 'nombreprovincia', 'provincia_name']),
      );

      if (!provinciaName) {
        continue;
      }

      // Defensive guard: ignore rows where "Provincia" is numeric-only.
      if (!hasAlphabeticCharacter(provinciaName)) {
        continue;
      }

      const existing = await this.provincias.findByNombre(provinciaName);
      if (existing) {
        skippedCount += 1;
        duplicates.push(provinciaName);
        continue;
      }

      const latitud = parseDecimal(
        findRowValue(row, ['latitud', 'latitude', 'lat'], { allowContains: true }),
      );
      const longitud = parseDecimal(
        findRowValue(row, ['longitud', 'longitude', 'lng', 'lon'], { allowContains: true }),
      );

      await createProvincia.execute({
        provincia: provinciaName,
        latitud,
        longitud,
        creadoPor,
      });

      importedCount += 1;
    }

    if (importedCount === 0 && skippedCount === 0) {
      throw new ValidationError(
        `No se encontraron provincias válidas en el archivo ${fileName}`,
      );
    }

    return {
      importedCount,
      skippedCount,
      duplicates,
    };
  }
}
