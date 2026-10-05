import * as XLSX from 'xlsx';

import { ValidationError } from '../../../../core/errors/app-error';
import { MarcaProductoRepository } from '../../domain/repositories/marca-producto-repository';
import { CreateMarcaProductoUseCase } from '../use-cases/create-marca-producto.use-case';

export interface ImportMarcasProductosExcelResult {
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

export class ImportMarcasProductosExcelService {
  constructor(private readonly repository: MarcaProductoRepository) {}

  async execute(
    buffer: Buffer,
    fileName: string,
    creadoPor: number,
  ): Promise<ImportMarcasProductosExcelResult> {
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

    const createMarca = new CreateMarcaProductoUseCase(this.repository);
    const existingItems = await this.repository.findMany();

    let importedCount = 0;
    let skippedCount = 0;
    const duplicates: string[] = [];

    for (const row of rows) {
      const anuncianteName = normalizeText(
        findRowValue(row, ['anunciante', 'nombreanunciante'], { allowContains: true }),
      );
      const categoriaName = normalizeText(
        findRowValue(row, ['categoriaanunciante', 'categoria'], { allowContains: true }),
      );
      const marcaName = normalizeText(
        findRowValue(row, ['marcaproducto', 'marca', 'producto', 'nombre'], { allowContains: true }),
      );

      if (!marcaName || !hasAlphabeticCharacter(marcaName)) {
        skippedCount += 1;
        continue;
      }

      let idAnunciante = parseInteger(findRowValue(row, ['idanunciante']));
      let idCategoriaAnunciante = parseInteger(findRowValue(row, ['idcategoriaanunciante']));

      if (!idAnunciante && anuncianteName) {
        const match = existingItems.find((item) => {
          const anuncio = item.toPrimitives();
          if (normalizeText(anuncio.anunciante).toLowerCase() !== anuncianteName.toLowerCase()) {
            return false;
          }
          if (idCategoriaAnunciante && anuncio.idCategoriaAnunciante !== idCategoriaAnunciante) {
            return false;
          }
          return true;
        });

        if (match) {
          idAnunciante = match.toPrimitives().idAnunciante;
        }
      }

      if (!idCategoriaAnunciante && categoriaName) {
        const match = existingItems.find((item) => {
          const anuncio = item.toPrimitives();
          return normalizeText(anuncio.categoriaAnunciante).toLowerCase() === categoriaName.toLowerCase();
        });
        if (match) {
          idCategoriaAnunciante = match.toPrimitives().idCategoriaAnunciante;
        }
      }

      if (!idAnunciante || !idCategoriaAnunciante) {
        skippedCount += 1;
        continue;
      }

      const existing = await this.repository.findByNombreInAnunciante(idAnunciante, marcaName);
      if (existing) {
        skippedCount += 1;
        duplicates.push(`${marcaName} (${anuncianteName || idAnunciante})`);
        continue;
      }

      await createMarca.execute({
        idAnunciante,
        idCategoriaAnunciante,
        marcaProducto: marcaName,
        creadoPor,
      });

      importedCount += 1;
    }

    if (importedCount === 0 && skippedCount === 0) {
      throw new ValidationError(`No se encontraron marcas validas en el archivo ${fileName}`);
    }

    return {
      importedCount,
      skippedCount,
      duplicates,
    };
  }
}
