import * as XLSX from 'xlsx';

import { ValidationError } from '../../../../core/errors/app-error';
import { SectorIndustrialRepository } from '../../../sectores-industriales/domain/repositories/sector-industrial-repository';
import { SubSectorIndustrialRepository } from '../../domain/repositories/sub-sector-industrial-repository';
import { CreateSubSectorIndustrialUseCase } from '../use-cases/create-sub-sector-industrial.use-case';

export interface ImportSubSectoresIndustrialesExcelResult {
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

export class ImportSubSectoresIndustrialesExcelService {
  constructor(
    private readonly subSectoresIndustriales: SubSectorIndustrialRepository,
    private readonly sectoresIndustriales: SectorIndustrialRepository,
  ) {}

  async execute(
    buffer: Buffer,
    fileName: string,
    creadoPor: number,
  ): Promise<ImportSubSectoresIndustrialesExcelResult> {
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

    const createSubSectorIndustrial = new CreateSubSectorIndustrialUseCase(
      this.subSectoresIndustriales,
      this.sectoresIndustriales,
    );
    const sectors = (await this.sectoresIndustriales.findMany()).map((item) => item.toPrimitives());

    let importedCount = 0;
    let skippedCount = 0;
    const duplicates: string[] = [];

    for (const row of rows) {
      const sectorName = normalizeText(
        findRowValue(row, ['sectorindustrial', 'sector', 'nombresectorindustrial'], {
          allowContains: true,
        }),
      );
      const subSectorName = normalizeText(
        findRowValue(row, ['subsectorindustrial', 'subsector', 'nombresubsectorindustrial', 'nombre']),
      );

      if (!subSectorName || !hasAlphabeticCharacter(subSectorName)) {
        skippedCount += 1;
        continue;
      }

      let idSectorIndustrial = parseInteger(findRowValue(row, ['idsectorindustrial']));

      if (!idSectorIndustrial && sectorName) {
        const matchingSector = sectors.find((item) => {
          return normalizeText(item.sectorIndustrial).toLowerCase() === sectorName.toLowerCase();
        });

        if (matchingSector) {
          idSectorIndustrial = matchingSector.idSectorIndustrial;
        }
      }

      if (!idSectorIndustrial) {
        skippedCount += 1;
        continue;
      }

      const existing = await this.subSectoresIndustriales.findByNombreInSector(
        idSectorIndustrial,
        subSectorName,
      );
      if (existing) {
        skippedCount += 1;
        duplicates.push(`${subSectorName} (${sectorName || idSectorIndustrial})`);
        continue;
      }

      await createSubSectorIndustrial.execute({
        idSectorIndustrial,
        subSectorIndustrial: subSectorName,
        creadoPor,
      });

      importedCount += 1;
    }

    if (importedCount === 0 && skippedCount === 0) {
      throw new ValidationError(`No se encontraron sub sectores industriales validos en el archivo ${fileName}`);
    }

    return {
      importedCount,
      skippedCount,
      duplicates,
    };
  }
}
