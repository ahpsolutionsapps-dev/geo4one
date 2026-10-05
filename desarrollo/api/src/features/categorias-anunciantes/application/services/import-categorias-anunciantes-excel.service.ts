import * as XLSX from 'xlsx';

import { ValidationError } from '../../../../core/errors/app-error';
import { CategoriaAnuncianteRepository } from '../../domain/repositories/categoria-anunciante-repository';
import { PrismaSectorIndustrialRepository } from '../../../sectores-industriales/infrastructure/repositories/prisma-sector-industrial.repository';
import { PrismaSubSectorIndustrialRepository } from '../../../sub-sectores-industriales/infrastructure/repositories/prisma-sub-sector-industrial.repository';
import { CreateCategoriaAnuncianteUseCase } from '../use-cases/create-categoria-anunciante.use-case';

export interface ImportCategoriasAnunciantesExcelResult {
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

export class ImportCategoriasAnunciantesExcelService {
  constructor(
    private readonly categoriaRepository: CategoriaAnuncianteRepository,
    private readonly sectorRepository: PrismaSectorIndustrialRepository,
    private readonly subSectorRepository: PrismaSubSectorIndustrialRepository,
  ) {}

  async execute(
    buffer: Buffer,
    fileName: string,
    creadoPor: number,
  ): Promise<ImportCategoriasAnunciantesExcelResult> {
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

    const createCategoria = new CreateCategoriaAnuncianteUseCase(
      this.categoriaRepository,
      this.sectorRepository,
      this.subSectorRepository,
    );
    const sectores = (await this.sectorRepository.findMany()).map((item) => item.toPrimitives());
    const subSectores = (await this.subSectorRepository.findMany()).map((item) => item.toPrimitives());

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
        findRowValue(row, ['subsectorindustrial', 'subsector', 'nombresubsectorindustrial'], {
          allowContains: true,
        }),
      );
      const categoriaName = normalizeText(
        findRowValue(row, ['categoriaanunciante', 'categoria', 'categoriaanunciante', 'nombre']),
      );

      if (!categoriaName || !hasAlphabeticCharacter(categoriaName)) {
        skippedCount += 1;
        continue;
      }

      let idSectorIndustrial = parseInteger(findRowValue(row, ['idsectorindustrial']));
      if (!idSectorIndustrial && sectorName) {
        const matching = sectores.find(
          (item) => normalizeText(item.sectorIndustrial).toLowerCase() === sectorName.toLowerCase(),
        );
        if (matching) {
          idSectorIndustrial = matching.idSectorIndustrial;
        }
      }

      let idSubSectorIndustrial = parseInteger(findRowValue(row, ['idsubsectorindustrial']));
      if (!idSubSectorIndustrial && subSectorName) {
        const matching = subSectores.find((item) => {
          if (normalizeText(item.subSectorIndustrial).toLowerCase() !== subSectorName.toLowerCase()) {
            return false;
          }
          if (!idSectorIndustrial) {
            return true;
          }
          return item.idSectorIndustrial === idSectorIndustrial;
        });
        if (matching) {
          idSubSectorIndustrial = matching.idSubSectorIndustrial;
        }
      }

      if (!idSectorIndustrial || !idSubSectorIndustrial) {
        skippedCount += 1;
        continue;
      }

      const existing = await this.categoriaRepository.findByNombreInSubSector(
        idSubSectorIndustrial,
        categoriaName,
      );
      if (existing) {
        skippedCount += 1;
        duplicates.push(`${categoriaName} (${subSectorName || idSubSectorIndustrial})`);
        continue;
      }

      await createCategoria.execute({
        idSectorIndustrial,
        idSubSectorIndustrial,
        categoriaAnunciante: categoriaName,
        creadoPor,
      });

      importedCount += 1;
    }

    if (importedCount === 0 && skippedCount === 0) {
      throw new ValidationError(`No se encontraron categorías validas en el archivo ${fileName}`);
    }

    return {
      importedCount,
      skippedCount,
      duplicates,
    };
  }
}
