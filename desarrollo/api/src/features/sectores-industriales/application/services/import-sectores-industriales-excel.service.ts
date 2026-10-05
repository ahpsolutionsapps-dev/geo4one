import * as XLSX from 'xlsx';

import { ValidationError } from '../../../../core/errors/app-error';
import { SectorIndustrialRepository } from '../../domain/repositories/sector-industrial-repository';
import { CreateSectorIndustrialUseCase } from '../use-cases/create-sector-industrial.use-case';

export interface ImportSectoresIndustrialesExcelResult {
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

export class ImportSectoresIndustrialesExcelService {
  constructor(private readonly sectoresIndustriales: SectorIndustrialRepository) {}

  async execute(
    buffer: Buffer,
    fileName: string,
    creadoPor: number,
  ): Promise<ImportSectoresIndustrialesExcelResult> {
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

    const createSectorIndustrial = new CreateSectorIndustrialUseCase(this.sectoresIndustriales);

    let importedCount = 0;
    let skippedCount = 0;
    const duplicates: string[] = [];

    for (const row of rows) {
      const sectorIndustrialName = normalizeText(
        findRowValue(row, ['sectorindustrial', 'sector', 'nombresectorindustrial', 'nombre']),
      );

      if (!sectorIndustrialName || !hasAlphabeticCharacter(sectorIndustrialName)) {
        skippedCount += 1;
        continue;
      }

      const existing = await this.sectoresIndustriales.findByNombre(sectorIndustrialName);
      if (existing) {
        skippedCount += 1;
        duplicates.push(sectorIndustrialName);
        continue;
      }

      await createSectorIndustrial.execute({
        sectorIndustrial: sectorIndustrialName,
        creadoPor,
      });

      importedCount += 1;
    }

    if (importedCount === 0 && skippedCount === 0) {
      throw new ValidationError(`No se encontraron sectores industriales validos en el archivo ${fileName}`);
    }

    return {
      importedCount,
      skippedCount,
      duplicates,
    };
  }
}
