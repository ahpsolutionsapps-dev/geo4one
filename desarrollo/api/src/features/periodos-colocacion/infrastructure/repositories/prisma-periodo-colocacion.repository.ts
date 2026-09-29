import { PrismaClient } from '@prisma/client';
import { PeriodoColocacion } from '../../domain/entities/periodo-colocacion';
import {
  CreatePeriodoColocacionInput,
  PeriodoColocacionRepository,
  UpdatePeriodoColocacionInput,
} from '../../domain/repositories/periodo-colocacion-repository';

function mapRow(row: {
  IdPeriodoColocacion: bigint;
  FechaInicial: Date;
  FechaFinal: Date;
  GeneralesSeguimiento: string | null;
  Activo: boolean;
  FechaCreacion: Date;
  FechaActualizacion: Date;
  CreadoPor: bigint | null;
  ActualizadoPor: bigint | null;
}) {
  return new PeriodoColocacion({
    idPeriodoColocacion: Number(row.IdPeriodoColocacion),
    fechaInicial: row.FechaInicial,
    fechaFinal: row.FechaFinal,
    generalesSeguimiento: row.GeneralesSeguimiento,
    activo: row.Activo,
    fechaCreacion: row.FechaCreacion,
    fechaActualizacion: row.FechaActualizacion,
    creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
    actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
  });
}

export class PrismaPeriodoColocacionRepository implements PeriodoColocacionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMany(): Promise<PeriodoColocacion[]> {
    const rows = await this.prisma.periodosColocacion.findMany({
      orderBy: [{ FechaInicial: 'desc' }, { FechaFinal: 'desc' }],
    });

    return rows.map(mapRow);
  }

  async findById(idPeriodoColocacion: number): Promise<PeriodoColocacion | null> {
    const row = await this.prisma.periodosColocacion.findUnique({
      where: { IdPeriodoColocacion: BigInt(idPeriodoColocacion) },
    });

    return row ? mapRow(row) : null;
  }

  async create(input: CreatePeriodoColocacionInput): Promise<PeriodoColocacion> {
    const row = await this.prisma.periodosColocacion.create({
      data: {
        FechaInicial: input.fechaInicial,
        FechaFinal: input.fechaFinal,
        GeneralesSeguimiento: input.generalesSeguimiento ?? null,
        Activo: true,
        FechaCreacion: new Date(),
        FechaActualizacion: new Date(),
        CreadoPor: BigInt(input.creadoPor),
        ActualizadoPor: BigInt(input.creadoPor),
      },
    });

    return mapRow(row);
  }

  async update(
    idPeriodoColocacion: number,
    input: UpdatePeriodoColocacionInput,
  ): Promise<PeriodoColocacion> {
    const row = await this.prisma.periodosColocacion.update({
      where: { IdPeriodoColocacion: BigInt(idPeriodoColocacion) },
      data: {
        ...(input.fechaInicial !== undefined ? { FechaInicial: input.fechaInicial } : {}),
        ...(input.fechaFinal !== undefined ? { FechaFinal: input.fechaFinal } : {}),
        ...(input.generalesSeguimiento !== undefined
          ? { GeneralesSeguimiento: input.generalesSeguimiento }
          : {}),
        ...(input.activo !== undefined ? { Activo: input.activo } : {}),
        FechaActualizacion: new Date(),
        ActualizadoPor: BigInt(input.actualizadoPor),
      },
    });

    return mapRow(row);
  }

  async deactivate(idPeriodoColocacion: number, actualizadoPor: number): Promise<void> {
    await this.prisma.periodosColocacion.update({
      where: { IdPeriodoColocacion: BigInt(idPeriodoColocacion) },
      data: {
        Activo: false,
        FechaActualizacion: new Date(),
        ActualizadoPor: BigInt(actualizadoPor),
      },
    });
  }
}
