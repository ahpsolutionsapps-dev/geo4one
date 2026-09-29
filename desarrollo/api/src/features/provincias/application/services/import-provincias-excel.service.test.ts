import { describe, expect, it } from 'vitest';
import * as XLSX from 'xlsx';

import { InMemoryProvinciaRepository } from '../../infrastructure/repositories/in-memory-provincia.repository';
import { ImportProvinciasExcelService } from './import-provincias-excel.service';

describe('ImportProvinciasExcelService', () => {
  it('should import provinces from an Excel file and skip duplicates', async () => {
    const repository = new InMemoryProvinciaRepository();
    const service = new ImportProvinciasExcelService(repository);

    repository.seed([
      { idProvincia: 1, provincia: 'Santa Cruz', latitud: null, longitud: null, activo: true },
    ]);

    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet([
      { Provincia: 'Santa Cruz', Latitud: -17.7834, Longitud: -63.1821 },
      { Provincia: 'La Paz', Latitud: -16.5, Longitud: -68.15 },
      { Provincia: 'Cochabamba', Latitud: -17.3895, Longitud: -66.1568 },
    ]);
    XLSX.utils.book_append_sheet(workbook, sheet, 'Provincias');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const result = await service.execute(buffer, 'provincias.xlsx', 99);

    expect(result.importedCount).toBe(2);
    expect(result.skippedCount).toBe(1);
    expect(result.duplicates).toEqual(['Santa Cruz']);
    expect(await repository.findByNombre('La Paz')).not.toBeNull();
  });

  it('should import coordinates when the Excel headers include descriptive suffixes', async () => {
    const repository = new InMemoryProvinciaRepository();
    const service = new ImportProvinciasExcelService(repository);

    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet([
      { Provincia: 'San Juan', 'Latitud (WGS84)': 18.5, 'Longitud (WGS84)': -69.75 },
    ]);
    XLSX.utils.book_append_sheet(workbook, sheet, 'Provincias');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const result = await service.execute(buffer, 'provincias.xlsx', 99);

    expect(result.importedCount).toBe(1);

    const provincia = await repository.findByNombre('San Juan');
    expect(provincia).not.toBeNull();
    expect(provincia?.toPrimitives().latitud).toBe(18.5);
    expect(provincia?.toPrimitives().longitud).toBe(-69.75);
  });

  it('should parse exported coordinate values formatted with thousands separators', async () => {
    const repository = new InMemoryProvinciaRepository();
    const service = new ImportProvinciasExcelService(repository);

    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet([
      {
        Provincia: 'Santiago',
        Latitud: '184,861,000',
        Longitud: '-699,312,000',
      },
    ]);
    XLSX.utils.book_append_sheet(workbook, sheet, 'Provincias');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const result = await service.execute(buffer, 'provincias.xlsx', 99);

    expect(result.importedCount).toBe(1);

    const provincia = await repository.findByNombre('Santiago');
    expect(provincia?.toPrimitives().latitud).toBe(18.4861);
    expect(provincia?.toPrimitives().longitud).toBe(-69.9312);
  });

  it('should prefer Provincia over IdProvincia when both columns exist', async () => {
    const repository = new InMemoryProvinciaRepository();
    const service = new ImportProvinciasExcelService(repository);

    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet([
      {
        IdProvincia: 1,
        Provincia: 'Distrito Nacional',
        Latitud: '184,861,000',
        Longitud: '-699,312,000',
      },
    ]);
    XLSX.utils.book_append_sheet(workbook, sheet, 'Provincias');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const result = await service.execute(buffer, 'provincias.xlsx', 99);

    expect(result.importedCount).toBe(1);
    expect(await repository.findByNombre('Distrito Nacional')).not.toBeNull();
    expect(await repository.findByNombre('1')).toBeNull();
  });

  it('should ignore rows where Provincia is numeric-only', async () => {
    const repository = new InMemoryProvinciaRepository();
    const service = new ImportProvinciasExcelService(repository);

    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet([
      { Provincia: '123', Latitud: '184,861,000', Longitud: '-699,312,000' },
      { Provincia: 'Santiago', Latitud: '194,500,000', Longitud: '-706,900,000' },
    ]);
    XLSX.utils.book_append_sheet(workbook, sheet, 'Provincias');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const result = await service.execute(buffer, 'provincias.xlsx', 99);

    expect(result.importedCount).toBe(1);
    expect(await repository.findByNombre('123')).toBeNull();
    expect(await repository.findByNombre('Santiago')).not.toBeNull();
  });
});
