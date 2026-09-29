import { PrismaClient } from '@prisma/client';
import { SubSectorIndustrial } from '../../domain/entities/sub-sector-industrial';
import {
  CreateSubSectorIndustrialInput,
  SubSectorIndustrialRepository,
  UpdateSubSectorIndustrialInput,
} from '../../domain/repositories/sub-sector-industrial-repository';

function mapRow(row: {
  IdSubSectorIndustrial: bigint;
  IdSectorIndustrial: bigint;
  SubSectorIndustrial: string;
  Activo: boolean;
  FechaCreacion: Date;
  FechaActualizacion: Date;
  CreadoPor: bigint | null;
  ActualizadoPor: bigint | null;
  SectoresIndustriales: { SectorIndustrial: string };
}) {
  return new SubSectorIndustrial({
    idSubSectorIndustrial: Number(row.IdSubSectorIndustrial),
    idSectorIndustrial: Number(row.IdSectorIndustrial),
    sectorIndustrial: row.SectoresIndustriales.SectorIndustrial,
    subSectorIndustrial: row.SubSectorIndustrial,
    activo: row.Activo,
    fechaCreacion: row.FechaCreacion,
    fechaActualizacion: row.FechaActualizacion,
    creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
    actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
  });
}

export class PrismaSubSectorIndustrialRepository implements SubSectorIndustrialRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMany(): Promise<SubSectorIndustrial[]> {
    const rows = await this.prisma.subSectoresIndustriales.findMany({
      include: {
        SectoresIndustriales: { select: { SectorIndustrial: true } },
      },
      orderBy: [
        { SectoresIndustriales: { SectorIndustrial: 'asc' } },
        { SubSectorIndustrial: 'asc' },
      ],
    });

    return rows.map(mapRow);
  }

  async findById(idSubSectorIndustrial: number): Promise<SubSectorIndustrial | null> {
    const row = await this.prisma.subSectoresIndustriales.findUnique({
      where: { IdSubSectorIndustrial: BigInt(idSubSectorIndustrial) },
      include: {
        SectoresIndustriales: { select: { SectorIndustrial: true } },
      },
    });

    return row ? mapRow(row) : null;
  }

  async findByNombreInSector(
    idSectorIndustrial: number,
    subSectorIndustrial: string,
  ): Promise<SubSectorIndustrial | null> {
    const row = await this.prisma.subSectoresIndustriales.findFirst({
      where: {
        IdSectorIndustrial: BigInt(idSectorIndustrial),
        SubSectorIndustrial: subSectorIndustrial,
      },
      include: {
        SectoresIndustriales: { select: { SectorIndustrial: true } },
      },
    });

    return row ? mapRow(row) : null;
  }

  async create(input: CreateSubSectorIndustrialInput): Promise<SubSectorIndustrial> {
    const row = await this.prisma.subSectoresIndustriales.create({
      data: {
        IdSectorIndustrial: BigInt(input.idSectorIndustrial),
        SubSectorIndustrial: input.subSectorIndustrial,
        Activo: true,
        FechaCreacion: new Date(),
        FechaActualizacion: new Date(),
        CreadoPor: BigInt(input.creadoPor),
        ActualizadoPor: BigInt(input.creadoPor),
      },
      include: {
        SectoresIndustriales: { select: { SectorIndustrial: true } },
      },
    });

    return mapRow(row);
  }

  async update(
    idSubSectorIndustrial: number,
    input: UpdateSubSectorIndustrialInput,
  ): Promise<SubSectorIndustrial> {
    const row = await this.prisma.subSectoresIndustriales.update({
      where: { IdSubSectorIndustrial: BigInt(idSubSectorIndustrial) },
      data: {
        ...(input.idSectorIndustrial !== undefined
          ? { IdSectorIndustrial: BigInt(input.idSectorIndustrial) }
          : {}),
        ...(input.subSectorIndustrial !== undefined
          ? { SubSectorIndustrial: input.subSectorIndustrial }
          : {}),
        ...(input.activo !== undefined ? { Activo: input.activo } : {}),
        FechaActualizacion: new Date(),
        ActualizadoPor: BigInt(input.actualizadoPor),
      },
      include: {
        SectoresIndustriales: { select: { SectorIndustrial: true } },
      },
    });

    return mapRow(row);
  }

  async deactivate(idSubSectorIndustrial: number, actualizadoPor: number): Promise<void> {
    await this.prisma.subSectoresIndustriales.update({
      where: { IdSubSectorIndustrial: BigInt(idSubSectorIndustrial) },
      data: {
        Activo: false,
        FechaActualizacion: new Date(),
        ActualizadoPor: BigInt(actualizadoPor),
      },
    });
  }
}