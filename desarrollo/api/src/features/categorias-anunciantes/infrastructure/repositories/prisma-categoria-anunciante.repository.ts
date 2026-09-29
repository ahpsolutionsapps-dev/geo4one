import { PrismaClient } from '@prisma/client';
import { CategoriaAnunciante } from '../../domain/entities/categoria-anunciante';
import {
  CategoriaAnuncianteRepository,
  CreateCategoriaAnuncianteInput,
  UpdateCategoriaAnuncianteInput,
} from '../../domain/repositories/categoria-anunciante-repository';

function mapRow(row: {
  IdCategoriaAnunciante: bigint;
  IdSectorIndustrial: bigint;
  IdSubSectorIndustrial: bigint;
  CategoriaAnunciante: string;
  Activo: boolean;
  FechaCreacion: Date;
  FechaActualizacion: Date;
  CreadoPor: bigint | null;
  ActualizadoPor: bigint | null;
  SectoresIndustriales: { SectorIndustrial: string };
  SubSectoresIndustriales: { SubSectorIndustrial: string };
}) {
  return new CategoriaAnunciante({
    idCategoriaAnunciante: Number(row.IdCategoriaAnunciante),
    idSectorIndustrial: Number(row.IdSectorIndustrial),
    sectorIndustrial: row.SectoresIndustriales.SectorIndustrial,
    idSubSectorIndustrial: Number(row.IdSubSectorIndustrial),
    subSectorIndustrial: row.SubSectoresIndustriales.SubSectorIndustrial,
    categoriaAnunciante: row.CategoriaAnunciante,
    activo: row.Activo,
    fechaCreacion: row.FechaCreacion,
    fechaActualizacion: row.FechaActualizacion,
    creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
    actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
  });
}

export class PrismaCategoriaAnuncianteRepository implements CategoriaAnuncianteRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMany(): Promise<CategoriaAnunciante[]> {
    const rows = await this.prisma.categoriasAnunciantes.findMany({
      include: {
        SectoresIndustriales: { select: { SectorIndustrial: true } },
        SubSectoresIndustriales: { select: { SubSectorIndustrial: true } },
      },
      orderBy: [
        { SectoresIndustriales: { SectorIndustrial: 'asc' } },
        { SubSectoresIndustriales: { SubSectorIndustrial: 'asc' } },
        { CategoriaAnunciante: 'asc' },
      ],
    });

    return rows.map(mapRow);
  }

  async findById(idCategoriaAnunciante: number): Promise<CategoriaAnunciante | null> {
    const row = await this.prisma.categoriasAnunciantes.findUnique({
      where: { IdCategoriaAnunciante: BigInt(idCategoriaAnunciante) },
      include: {
        SectoresIndustriales: { select: { SectorIndustrial: true } },
        SubSectoresIndustriales: { select: { SubSectorIndustrial: true } },
      },
    });

    return row ? mapRow(row) : null;
  }

  async findByNombreInSubSector(
    idSubSectorIndustrial: number,
    categoriaAnunciante: string,
  ): Promise<CategoriaAnunciante | null> {
    const row = await this.prisma.categoriasAnunciantes.findFirst({
      where: {
        IdSubSectorIndustrial: BigInt(idSubSectorIndustrial),
        CategoriaAnunciante: categoriaAnunciante,
      },
      include: {
        SectoresIndustriales: { select: { SectorIndustrial: true } },
        SubSectoresIndustriales: { select: { SubSectorIndustrial: true } },
      },
    });

    return row ? mapRow(row) : null;
  }

  async create(input: CreateCategoriaAnuncianteInput): Promise<CategoriaAnunciante> {
    const row = await this.prisma.categoriasAnunciantes.create({
      data: {
        IdSectorIndustrial: BigInt(input.idSectorIndustrial),
        IdSubSectorIndustrial: BigInt(input.idSubSectorIndustrial),
        CategoriaAnunciante: input.categoriaAnunciante,
        Activo: true,
        FechaCreacion: new Date(),
        FechaActualizacion: new Date(),
        CreadoPor: BigInt(input.creadoPor),
        ActualizadoPor: BigInt(input.creadoPor),
      },
      include: {
        SectoresIndustriales: { select: { SectorIndustrial: true } },
        SubSectoresIndustriales: { select: { SubSectorIndustrial: true } },
      },
    });

    return mapRow(row);
  }

  async update(
    idCategoriaAnunciante: number,
    input: UpdateCategoriaAnuncianteInput,
  ): Promise<CategoriaAnunciante> {
    const row = await this.prisma.categoriasAnunciantes.update({
      where: { IdCategoriaAnunciante: BigInt(idCategoriaAnunciante) },
      data: {
        ...(input.idSectorIndustrial !== undefined
          ? { IdSectorIndustrial: BigInt(input.idSectorIndustrial) }
          : {}),
        ...(input.idSubSectorIndustrial !== undefined
          ? { IdSubSectorIndustrial: BigInt(input.idSubSectorIndustrial) }
          : {}),
        ...(input.categoriaAnunciante !== undefined
          ? { CategoriaAnunciante: input.categoriaAnunciante }
          : {}),
        ...(input.activo !== undefined ? { Activo: input.activo } : {}),
        FechaActualizacion: new Date(),
        ActualizadoPor: BigInt(input.actualizadoPor),
      },
      include: {
        SectoresIndustriales: { select: { SectorIndustrial: true } },
        SubSectoresIndustriales: { select: { SubSectorIndustrial: true } },
      },
    });

    return mapRow(row);
  }

  async deactivate(idCategoriaAnunciante: number, actualizadoPor: number): Promise<void> {
    await this.prisma.categoriasAnunciantes.update({
      where: { IdCategoriaAnunciante: BigInt(idCategoriaAnunciante) },
      data: {
        Activo: false,
        FechaActualizacion: new Date(),
        ActualizadoPor: BigInt(actualizadoPor),
      },
    });
  }
}