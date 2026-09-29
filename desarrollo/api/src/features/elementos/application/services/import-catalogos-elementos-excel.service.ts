import * as XLSX from 'xlsx';

import { ValidationError } from '../../../../core/errors/app-error';
import { ElementoRepository } from '../../domain/repositories/elemento-repository';

export interface ImportCatalogoExcelResult {
  importedCount: number;
  skippedCount: number;
  duplicates: string[];
}

export type CatalogoSimpleKind = 'tipos-elementos' | 'orientaciones' | 'dimensiones';

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

export class ImportCatalogosElementosExcelService {
  constructor(private readonly repository: ElementoRepository) {}

  private readRows(buffer: Buffer): Record<string, unknown>[] {
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

    return rows;
  }

  async importSimple(
    kind: CatalogoSimpleKind,
    buffer: Buffer,
    fileName: string,
    userId: number,
  ): Promise<ImportCatalogoExcelResult> {
    const rows = this.readRows(buffer);

    const map = {
      'tipos-elementos': {
        list: () => this.repository.findTiposElementosCatalogo(),
        create: (nombre: string) =>
          this.repository.createTipoElementoCatalogo({ nombre, creadoPor: userId }),
      },
      orientaciones: {
        list: () => this.repository.findOrientacionesCatalogo(),
        create: (nombre: string) =>
          this.repository.createOrientacionCatalogo({ nombre, creadoPor: userId }),
      },
      dimensiones: {
        list: () => this.repository.findDimensionesCatalogo(),
        create: (nombre: string) =>
          this.repository.createDimensionCatalogo({ nombre, creadoPor: userId }),
      },
    }[kind];

    const existing = await map.list();
    const knownNames = new Set(existing.map((item) => normalizeCompare(item.nombre)));

    let importedCount = 0;
    let skippedCount = 0;
    const duplicates: string[] = [];

    for (const row of rows) {
      const nombre = normalizeText(findRowValue(row, ['nombre', 'tipo', 'valor', 'descripcion']));

      if (!nombre || !hasAlphabeticCharacter(nombre)) {
        skippedCount += 1;
        continue;
      }

      const key = normalizeCompare(nombre);
      if (knownNames.has(key)) {
        skippedCount += 1;
        duplicates.push(nombre);
        continue;
      }

      await map.create(nombre);
      knownNames.add(key);
      importedCount += 1;
    }

    if (importedCount === 0 && skippedCount === 0) {
      throw new ValidationError(`No se encontraron filas validas en el archivo ${fileName}`);
    }

    return {
      importedCount,
      skippedCount,
      duplicates,
    };
  }

  async importFormatos(
    buffer: Buffer,
    fileName: string,
    userId: number,
  ): Promise<ImportCatalogoExcelResult> {
    const rows = this.readRows(buffer);
    const tiposElementos = await this.repository.findTiposElementosCatalogo();
    const tiposByName = new Map(tiposElementos.map((item) => [normalizeCompare(item.nombre), item.id]));

    const formatos = await this.repository.findFormatosCatalogo();
    const formatKeys = new Set(
      formatos.map((item) => `${item.idTipoElemento}:${normalizeCompare(item.nombre)}`),
    );

    let importedCount = 0;
    let skippedCount = 0;
    const duplicates: string[] = [];

    for (const row of rows) {
      const formato = normalizeText(findRowValue(row, ['formato', 'nombre', 'tipoformato']));
      if (!formato || !hasAlphabeticCharacter(formato)) {
        skippedCount += 1;
        continue;
      }

      const idTipoElementoRaw = findRowValue(row, ['idtipoelemento']);
      const tipoElementoName = normalizeText(
        findRowValue(row, ['tipoelemento', 'nombretipoelemento', 'tipo']),
      );

      let idTipoElemento = parseInteger(idTipoElementoRaw);
      if (!idTipoElemento && tipoElementoName) {
        idTipoElemento = tiposByName.get(normalizeCompare(tipoElementoName)) ?? null;
      }

      if (!idTipoElemento) {
        skippedCount += 1;
        continue;
      }

      const duplicateKey = `${idTipoElemento}:${normalizeCompare(formato)}`;
      if (formatKeys.has(duplicateKey)) {
        skippedCount += 1;
        duplicates.push(formato);
        continue;
      }

      await this.repository.createFormatoCatalogo({
        idTipoElemento,
        formato,
        creadoPor: userId,
      });

      formatKeys.add(duplicateKey);
      importedCount += 1;
    }

    if (importedCount === 0 && skippedCount === 0) {
      throw new ValidationError(`No se encontraron filas validas en el archivo ${fileName}`);
    }

    return {
      importedCount,
      skippedCount,
      duplicates,
    };
  }
}