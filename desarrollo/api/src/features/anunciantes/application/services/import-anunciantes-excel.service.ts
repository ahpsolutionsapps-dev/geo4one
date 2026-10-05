import * as XLSX from 'xlsx';

import { ValidationError } from '../../../../core/errors/app-error';
import { AnuncianteRepository } from '../../domain/repositories/anunciante-repository';
import { CreateAnuncianteUseCase } from '../use-cases/create-anunciante.use-case';

export interface ImportAnunciantesExcelResult {
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

export class ImportAnunciantesExcelService {
  constructor(private readonly repository: AnuncianteRepository) {}

  async execute(
    buffer: Buffer,
    fileName: string,
    creadoPor: number,
  ): Promise<ImportAnunciantesExcelResult> {
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

    const createAnunciante = new CreateAnuncianteUseCase(this.repository);
    const sectores = await this.repository.findSectoresOptions();
    const subSectores = await this.repository.findSubSectoresOptions();
    const categorias = await this.repository.findCategoriasOptions();

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
        findRowValue(row, ['categoriaanunciante', 'categoria', 'nombrecategoriaanunciante'], {
          allowContains: true,
        }),
      );
      const anuncianteName = normalizeText(
        findRowValue(row, ['anunciante', 'nombreanunciante', 'nombre'], {
          allowContains: true,
        }),
      );

      if (!anuncianteName || !hasAlphabeticCharacter(anuncianteName)) {
        skippedCount += 1;
        continue;
      }

      let idSectorIndustrial = parseInteger(findRowValue(row, ['idsectorindustrial']));
      if (!idSectorIndustrial && sectorName) {
        const match = sectores.find(
          (item) => normalizeText(item.sectorIndustrial).toLowerCase() === sectorName.toLowerCase(),
        );
        if (match) {
          idSectorIndustrial = match.idSectorIndustrial;
        }
      }

      let idSubSectorIndustrial = parseInteger(findRowValue(row, ['idsubsectorindustrial']));
      if (!idSubSectorIndustrial && subSectorName) {
        const match = subSectores.find((item) => {
          if (normalizeText(item.subSectorIndustrial).toLowerCase() !== subSectorName.toLowerCase()) {
            return false;
          }
          if (!idSectorIndustrial) {
            return true;
          }
          return item.idSectorIndustrial === idSectorIndustrial;
        });
        if (match) {
          idSubSectorIndustrial = match.idSubSectorIndustrial;
        }
      }

      let idCategoriaAnunciante = parseInteger(findRowValue(row, ['idcategoriaanunciante']));
      if (!idCategoriaAnunciante && categoriaName) {
        const match = categorias.find((item) => {
          if (normalizeText(item.categoriaAnunciante).toLowerCase() !== categoriaName.toLowerCase()) {
            return false;
          }
          if (idSubSectorIndustrial && item.idSubSectorIndustrial !== idSubSectorIndustrial) {
            return false;
          }
          if (idSectorIndustrial && item.idSectorIndustrial !== idSectorIndustrial) {
            return false;
          }
          return true;
        });
        if (match) {
          idCategoriaAnunciante = match.idCategoriaAnunciante;
        }
      }

      if (!idSectorIndustrial || !idSubSectorIndustrial || !idCategoriaAnunciante) {
        skippedCount += 1;
        continue;
      }

      const existing = await this.repository.findByNombreInCategoria(idCategoriaAnunciante, anuncianteName);
      if (existing) {
        skippedCount += 1;
        duplicates.push(`${anuncianteName} (${categoriaName || idCategoriaAnunciante})`);
        continue;
      }

      await createAnunciante.execute({
        idSectorIndustrial,
        idSubSectorIndustrial,
        idCategoriaAnunciante,
        anunciante: anuncianteName,
        creadoPor,
      });

      importedCount += 1;
    }

    if (importedCount === 0 && skippedCount === 0) {
      throw new ValidationError(`No se encontraron anunciantes validos en el archivo ${fileName}`);
    }

    return {
      importedCount,
      skippedCount,
      duplicates,
    };
  }
}
