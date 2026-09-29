import { PrismaClient } from '@prisma/client';
import { SectorIndustrial } from '../../domain/entities/sector-industrial';
import {
  CreateSectorIndustrialInput,
  SectorIndustrialRepository,
  UpdateSectorIndustrialInput,
} from '../../domain/repositories/sector-industrial-repository';

function mapRow(row: {
  IdSectorIndustrial: bigint;
  SectorIndustrial: string;
  Activo: boolean;
  FechaCreacion: Date;
  FechaActualizacion: Date;
  CreadoPor: bigint | null;
  ActualizadoPor: bigint | null;
}) {
  return new SectorIndustrial({
    idSectorIndustrial: Number(row.IdSectorIndustrial),
    sectorIndustrial: row.SectorIndustrial,
    activo: row.Activo,
    fechaCreacion: row.FechaCreacion,
    fechaActualizacion: row.FechaActualizacion,
    creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
    actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
  });
}

export class PrismaSectorIndustrialRepository implements SectorIndustrialRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMany(): Promise<SectorIndustrial[]> {
    const rows = await this.prisma.sectoresIndustriales.findMany({
      orderBy: { SectorIndustrial: 'asc' },
    });

    return rows.map(mapRow);
  }

  async findById(idSectorIndustrial: number): Promise<SectorIndustrial | null> {
    const row = await this.prisma.sectoresIndustriales.findUnique({
      where: { IdSectorIndustrial: BigInt(idSectorIndustrial) },
    });

    return row ? mapRow(row) : null;
  }

  async findByNombre(sectorIndustrial: string): Promise<SectorIndustrial | null> {
    const row = await this.prisma.sectoresIndustriales.findFirst({
      where: { SectorIndustrial: sectorIndustrial },
    });

    return row ? mapRow(row) : null;
  }

  async create(input: CreateSectorIndustrialInput): Promise<SectorIndustrial> {
    const row = await this.prisma.sectoresIndustriales.create({
      data: {
        SectorIndustrial: input.sectorIndustrial,
        Activo: true,
        FechaCreacion: new Date(),
        FechaActualizacion: new Date(),
        CreadoPor: BigInt(input.creadoPor),
        ActualizadoPor: BigInt(input.creadoPor),
      },
    });

    return mapRow(row);
  }

  async update(idSectorIndustrial: number, input: UpdateSectorIndustrialInput): Promise<SectorIndustrial> {
    const row = await this.prisma.sectoresIndustriales.update({
      where: { IdSectorIndustrial: BigInt(idSectorIndustrial) },
      data: {
        ...(input.sectorIndustrial !== undefined ? { SectorIndustrial: input.sectorIndustrial } : {}),
        ...(input.activo !== undefined ? { Activo: input.activo } : {}),
        FechaActualizacion: new Date(),
        ActualizadoPor: BigInt(input.actualizadoPor),
      },
    });

    return mapRow(row);
  }

  async deactivate(idSectorIndustrial: number, actualizadoPor: number): Promise<void> {
    await this.prisma.sectoresIndustriales.update({
      where: { IdSectorIndustrial: BigInt(idSectorIndustrial) },
      data: {
        Activo: false,
        FechaActualizacion: new Date(),
        ActualizadoPor: BigInt(actualizadoPor),
      },
    });
  }
}