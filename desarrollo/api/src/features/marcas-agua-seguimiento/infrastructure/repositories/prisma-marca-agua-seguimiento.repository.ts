import { PrismaClient } from '@prisma/client';
import { MarcaAguaSeguimiento } from '../../domain/entities/marca-agua-seguimiento';
import {
  CreateMarcaAguaSeguimientoInput,
  MarcaAguaSeguimientoRepository,
  UpdateMarcaAguaSeguimientoInput,
  VersionCampanaLookup,
  VersionCampanaOption,
} from '../../domain/repositories/marca-agua-seguimiento-repository';

function mapRow(row: {
  IdFirmaMarcaAguaSeguimiento: bigint;
  IdVersionCampana: bigint;
  ImagenMuestra: string | null;
  VideoMuestra: string | null;
  Activo: boolean;
  FechaCreacion: Date;
  FechaActualizacion: Date;
  CreadoPor: bigint | null;
  ActualizadoPor: bigint | null;
  VersionesCampanas: {
    VersionCampana: string;
    Anunciantes: { Anunciante: string };
  };
}) {
  return new MarcaAguaSeguimiento({
    idFirmaMarcaAguaSeguimiento: Number(row.IdFirmaMarcaAguaSeguimiento),
    idVersionCampana: Number(row.IdVersionCampana),
    versionCampana: row.VersionesCampanas.VersionCampana,
    anunciante: row.VersionesCampanas.Anunciantes.Anunciante,
    imagenMuestra: row.ImagenMuestra,
    videoMuestra: row.VideoMuestra,
    activo: row.Activo,
    fechaCreacion: row.FechaCreacion,
    fechaActualizacion: row.FechaActualizacion,
    creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
    actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
  });
}

export class PrismaMarcaAguaSeguimientoRepository implements MarcaAguaSeguimientoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMany(): Promise<MarcaAguaSeguimiento[]> {
    const rows = await this.prisma.firmasMarcasAguaSeguimiento.findMany({
      include: {
        VersionesCampanas: {
          select: {
            VersionCampana: true,
            Anunciantes: { select: { Anunciante: true } },
          },
        },
      },
      orderBy: [{ VersionesCampanas: { VersionCampana: 'asc' } }, { FechaCreacion: 'desc' }],
    });

    return rows.map(mapRow);
  }

  async findById(idFirmaMarcaAguaSeguimiento: number): Promise<MarcaAguaSeguimiento | null> {
    const row = await this.prisma.firmasMarcasAguaSeguimiento.findUnique({
      where: { IdFirmaMarcaAguaSeguimiento: BigInt(idFirmaMarcaAguaSeguimiento) },
      include: {
        VersionesCampanas: {
          select: {
            VersionCampana: true,
            Anunciantes: { select: { Anunciante: true } },
          },
        },
      },
    });

    return row ? mapRow(row) : null;
  }

  async findVersionCampanaById(idVersionCampana: number): Promise<VersionCampanaLookup | null> {
    const row = await this.prisma.versionesCampanas.findUnique({
      where: { IdVersionCampana: BigInt(idVersionCampana) },
      select: {
        IdVersionCampana: true,
        VersionCampana: true,
        Activo: true,
        Anulado: true,
        Anunciantes: { select: { Anunciante: true } },
      },
    });

    if (!row) {
      return null;
    }

    return {
      idVersionCampana: Number(row.IdVersionCampana),
      versionCampana: row.VersionCampana,
      anunciante: row.Anunciantes.Anunciante,
      activo: row.Activo,
      anulado: row.Anulado,
    };
  }

  async findVersionCampanaOptions(): Promise<VersionCampanaOption[]> {
    const rows = await this.prisma.versionesCampanas.findMany({
      where: { Activo: true, Anulado: false },
      select: {
        IdVersionCampana: true,
        VersionCampana: true,
        Anunciantes: { select: { Anunciante: true } },
      },
      orderBy: [{ VersionCampana: 'asc' }],
    });

    return rows.map((row) => ({
      idVersionCampana: Number(row.IdVersionCampana),
      versionCampana: row.VersionCampana,
      anunciante: row.Anunciantes.Anunciante,
    }));
  }

  async create(input: CreateMarcaAguaSeguimientoInput): Promise<MarcaAguaSeguimiento> {
    const row = await this.prisma.firmasMarcasAguaSeguimiento.create({
      data: {
        IdVersionCampana: BigInt(input.idVersionCampana),
        ImagenMuestra: input.imagenMuestra ?? null,
        VideoMuestra: input.videoMuestra ?? null,
        Activo: true,
        FechaCreacion: new Date(),
        FechaActualizacion: new Date(),
        CreadoPor: BigInt(input.creadoPor),
        ActualizadoPor: BigInt(input.creadoPor),
      },
      include: {
        VersionesCampanas: {
          select: {
            VersionCampana: true,
            Anunciantes: { select: { Anunciante: true } },
          },
        },
      },
    });

    return mapRow(row);
  }

  async update(
    idFirmaMarcaAguaSeguimiento: number,
    input: UpdateMarcaAguaSeguimientoInput,
  ): Promise<MarcaAguaSeguimiento> {
    const row = await this.prisma.firmasMarcasAguaSeguimiento.update({
      where: { IdFirmaMarcaAguaSeguimiento: BigInt(idFirmaMarcaAguaSeguimiento) },
      data: {
        ...(input.idVersionCampana !== undefined
          ? { IdVersionCampana: BigInt(input.idVersionCampana) }
          : {}),
        ...(input.imagenMuestra !== undefined ? { ImagenMuestra: input.imagenMuestra } : {}),
        ...(input.videoMuestra !== undefined ? { VideoMuestra: input.videoMuestra } : {}),
        ...(input.activo !== undefined ? { Activo: input.activo } : {}),
        FechaActualizacion: new Date(),
        ActualizadoPor: BigInt(input.actualizadoPor),
      },
      include: {
        VersionesCampanas: {
          select: {
            VersionCampana: true,
            Anunciantes: { select: { Anunciante: true } },
          },
        },
      },
    });

    return mapRow(row);
  }

  async deactivate(idFirmaMarcaAguaSeguimiento: number, actualizadoPor: number): Promise<void> {
    await this.prisma.firmasMarcasAguaSeguimiento.update({
      where: { IdFirmaMarcaAguaSeguimiento: BigInt(idFirmaMarcaAguaSeguimiento) },
      data: {
        Activo: false,
        FechaActualizacion: new Date(),
        ActualizadoPor: BigInt(actualizadoPor),
      },
    });
  }
}
