import { PrismaClient } from '@prisma/client';
import { Sector } from '../../domain/entities/sector';
import {
  CreateSectorInput,
  SectorRepository,
  UpdateSectorInput,
} from '../../domain/repositories/sector-repository';

function mapRow(row: {
  IdSectorBarrio: bigint;
  IdMunicipio: bigint;
  SectorBarrio: string;
  Circunscripcion: string | null;
  Latitud: unknown;
  Longitud: unknown;
  Activo: boolean;
  FechaCreacion: Date;
  FechaActualizacion: Date;
  CreadoPor: bigint | null;
  ActualizadoPor: bigint | null;
  Municipios: { Municipio: string; Provincias: { Provincia: string } };
}) {
  return new Sector({
    idSectorBarrio: Number(row.IdSectorBarrio),
    idMunicipio: Number(row.IdMunicipio),
    municipioNombre: row.Municipios.Municipio,
    provinciaNombre: row.Municipios.Provincias.Provincia,
    sectorBarrio: row.SectorBarrio,
    circunscripcion: row.Circunscripcion,
    latitud: row.Latitud === null ? null : Number(row.Latitud),
    longitud: row.Longitud === null ? null : Number(row.Longitud),
    activo: row.Activo,
    fechaCreacion: row.FechaCreacion,
    fechaActualizacion: row.FechaActualizacion,
    creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
    actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
  });
}

export class PrismaSectorRepository implements SectorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMany(): Promise<Sector[]> {
    const rows = await this.prisma.sectoresBarrios.findMany({
      include: {
        Municipios: {
          select: {
            Municipio: true,
            Provincias: { select: { Provincia: true } },
          },
        },
      },
      orderBy: [
        { Municipios: { Provincias: { Provincia: 'asc' } } },
        { Municipios: { Municipio: 'asc' } },
        { SectorBarrio: 'asc' },
      ],
    });

    return rows.map(mapRow);
  }

  async findById(idSectorBarrio: number): Promise<Sector | null> {
    const row = await this.prisma.sectoresBarrios.findUnique({
      where: { IdSectorBarrio: BigInt(idSectorBarrio) },
      include: {
        Municipios: {
          select: {
            Municipio: true,
            Provincias: { select: { Provincia: true } },
          },
        },
      },
    });

    return row ? mapRow(row) : null;
  }

  async findByNombreInMunicipio(
    idMunicipio: number,
    sectorBarrio: string,
  ): Promise<Sector | null> {
    const row = await this.prisma.sectoresBarrios.findFirst({
      where: { IdMunicipio: BigInt(idMunicipio), SectorBarrio: sectorBarrio },
      include: {
        Municipios: {
          select: {
            Municipio: true,
            Provincias: { select: { Provincia: true } },
          },
        },
      },
    });

    return row ? mapRow(row) : null;
  }

  async create(input: CreateSectorInput): Promise<Sector> {
    const row = await this.prisma.sectoresBarrios.create({
      data: {
        IdMunicipio: BigInt(input.idMunicipio),
        SectorBarrio: input.sectorBarrio,
        Circunscripcion: input.circunscripcion ?? null,
        Latitud: input.latitud ?? null,
        Longitud: input.longitud ?? null,
        Activo: true,
        FechaCreacion: new Date(),
        FechaActualizacion: new Date(),
        CreadoPor: BigInt(input.creadoPor),
        ActualizadoPor: BigInt(input.creadoPor),
      },
      include: {
        Municipios: {
          select: {
            Municipio: true,
            Provincias: { select: { Provincia: true } },
          },
        },
      },
    });

    return mapRow(row);
  }

  async update(idSectorBarrio: number, input: UpdateSectorInput): Promise<Sector> {
    const row = await this.prisma.sectoresBarrios.update({
      where: { IdSectorBarrio: BigInt(idSectorBarrio) },
      data: {
        ...(input.idMunicipio !== undefined ? { IdMunicipio: BigInt(input.idMunicipio) } : {}),
        ...(input.sectorBarrio !== undefined ? { SectorBarrio: input.sectorBarrio } : {}),
        ...(input.circunscripcion !== undefined ? { Circunscripcion: input.circunscripcion } : {}),
        ...(input.latitud !== undefined ? { Latitud: input.latitud } : {}),
        ...(input.longitud !== undefined ? { Longitud: input.longitud } : {}),
        ...(input.activo !== undefined ? { Activo: input.activo } : {}),
        FechaActualizacion: new Date(),
        ActualizadoPor: BigInt(input.actualizadoPor),
      },
      include: {
        Municipios: {
          select: {
            Municipio: true,
            Provincias: { select: { Provincia: true } },
          },
        },
      },
    });

    return mapRow(row);
  }

  async deactivate(idSectorBarrio: number, actualizadoPor: number): Promise<void> {
    await this.prisma.sectoresBarrios.update({
      where: { IdSectorBarrio: BigInt(idSectorBarrio) },
      data: {
        Activo: false,
        FechaActualizacion: new Date(),
        ActualizadoPor: BigInt(actualizadoPor),
      },
    });
  }
}
