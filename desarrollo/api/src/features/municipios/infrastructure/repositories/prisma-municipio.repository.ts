import { PrismaClient } from '@prisma/client';
import { Municipio } from '../../domain/entities/municipio';
import {
  CreateMunicipioInput,
  MunicipioRepository,
  UpdateMunicipioInput,
} from '../../domain/repositories/municipio-repository';

function mapRow(row: {
  IdMunicipio: bigint;
  IdProvincia: bigint;
  Municipio: string;
  Latitud: unknown;
  Longitud: unknown;
  Activo: boolean;
  FechaCreacion: Date;
  FechaActualizacion: Date;
  CreadoPor: bigint | null;
  ActualizadoPor: bigint | null;
  Provincias: { Provincia: string };
}) {
  return new Municipio({
    idMunicipio: Number(row.IdMunicipio),
    idProvincia: Number(row.IdProvincia),
    provinciaNombre: row.Provincias.Provincia,
    municipio: row.Municipio,
    latitud: row.Latitud === null ? null : Number(row.Latitud),
    longitud: row.Longitud === null ? null : Number(row.Longitud),
    activo: row.Activo,
    fechaCreacion: row.FechaCreacion,
    fechaActualizacion: row.FechaActualizacion,
    creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
    actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
  });
}

export class PrismaMunicipioRepository implements MunicipioRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMany(): Promise<Municipio[]> {
    const rows = await this.prisma.municipios.findMany({
      include: { Provincias: { select: { Provincia: true } } },
      orderBy: [{ Provincias: { Provincia: 'asc' } }, { Municipio: 'asc' }],
    });

    return rows.map(mapRow);
  }

  async findById(idMunicipio: number): Promise<Municipio | null> {
    const row = await this.prisma.municipios.findUnique({
      where: { IdMunicipio: BigInt(idMunicipio) },
      include: { Provincias: { select: { Provincia: true } } },
    });

    return row ? mapRow(row) : null;
  }

  async findByNombreInProvincia(
    idProvincia: number,
    municipio: string,
  ): Promise<Municipio | null> {
    const row = await this.prisma.municipios.findFirst({
      where: { IdProvincia: BigInt(idProvincia), Municipio: municipio },
      include: { Provincias: { select: { Provincia: true } } },
    });

    return row ? mapRow(row) : null;
  }

  async create(input: CreateMunicipioInput): Promise<Municipio> {
    const row = await this.prisma.municipios.create({
      data: {
        IdProvincia: BigInt(input.idProvincia),
        Municipio: input.municipio,
        Latitud: input.latitud ?? null,
        Longitud: input.longitud ?? null,
        Activo: true,
        FechaCreacion: new Date(),
        FechaActualizacion: new Date(),
        CreadoPor: BigInt(input.creadoPor),
        ActualizadoPor: BigInt(input.creadoPor),
      },
      include: { Provincias: { select: { Provincia: true } } },
    });

    return mapRow(row);
  }

  async update(idMunicipio: number, input: UpdateMunicipioInput): Promise<Municipio> {
    const row = await this.prisma.municipios.update({
      where: { IdMunicipio: BigInt(idMunicipio) },
      data: {
        ...(input.idProvincia !== undefined ? { IdProvincia: BigInt(input.idProvincia) } : {}),
        ...(input.municipio !== undefined ? { Municipio: input.municipio } : {}),
        ...(input.latitud !== undefined ? { Latitud: input.latitud } : {}),
        ...(input.longitud !== undefined ? { Longitud: input.longitud } : {}),
        ...(input.activo !== undefined ? { Activo: input.activo } : {}),
        FechaActualizacion: new Date(),
        ActualizadoPor: BigInt(input.actualizadoPor),
      },
      include: { Provincias: { select: { Provincia: true } } },
    });

    return mapRow(row);
  }

  async deactivate(idMunicipio: number, actualizadoPor: number): Promise<void> {
    await this.prisma.municipios.update({
      where: { IdMunicipio: BigInt(idMunicipio) },
      data: {
        Activo: false,
        FechaActualizacion: new Date(),
        ActualizadoPor: BigInt(actualizadoPor),
      },
    });
  }
}
