import { PrismaClient, Prisma } from '@prisma/client';
import { Modulo } from '../../domain/entities/modulo';
import {
  FindModulosOptions,
  ModuloRepository,
} from '../../domain/repositories/modulo-repository';

type ModuloRow = {
  IdModulo: number;
  Codigo: string | null;
  NombreModulo: string;
  Icono: string | null;
  Ruta: string | null;
  IdPadre: number | null;
  OrderIndex: number | null;
  Oculto: boolean | null;
};

function toDomain(row: ModuloRow): Modulo {
  return new Modulo({
    idModulo: row.IdModulo,
    codigo: row.Codigo,
    nombreModulo: row.NombreModulo,
    icono: row.Icono,
    ruta: row.Ruta,
    idPadre: row.IdPadre,
    orderIndex: row.OrderIndex ?? 0,
    oculto: row.Oculto === true,
  });
}

export class PrismaModuloRepository implements ModuloRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByRolId(
    idRol: number,
    options?: FindModulosOptions,
  ): Promise<Modulo[]> {
    const includeHidden = options?.includeHidden === true;
    const assignedHiddenFilter = includeHidden
      ? Prisma.empty
      : Prisma.sql`AND m."Oculto" = FALSE`;
    const parentHiddenFilter = includeHidden
      ? Prisma.empty
      : Prisma.sql`WHERE parent."Oculto" = FALSE`;

    const rows = await this.prisma.$queryRaw<ModuloRow[]>(Prisma.sql`
      WITH RECURSIVE assigned AS (
        SELECT
          m."IdModulo",
          m."Codigo",
          m."NombreModulo",
          m."Icono",
          m."Ruta",
          m."IdPadre",
          m."OrderIndex",
          m."Oculto"
        FROM "Modulos" m
        INNER JOIN "RolModulos" rm ON rm."IdModulo" = m."IdModulo"
        WHERE rm."IdRol" = ${idRol}
          ${assignedHiddenFilter}

        UNION

        SELECT
          parent."IdModulo",
          parent."Codigo",
          parent."NombreModulo",
          parent."Icono",
          parent."Ruta",
          parent."IdPadre",
          parent."OrderIndex",
          parent."Oculto"
        FROM "Modulos" parent
        INNER JOIN assigned child ON child."IdPadre" = parent."IdModulo"
        ${parentHiddenFilter}
      )
      SELECT DISTINCT
        "IdModulo",
        "Codigo",
        "NombreModulo",
        "Icono",
        "Ruta",
        "IdPadre",
        "OrderIndex",
        "Oculto"
      FROM assigned
      ORDER BY "OrderIndex" ASC, "IdModulo" ASC
    `);

    return rows.map(toDomain);
  }

  async findAll(options?: FindModulosOptions): Promise<Modulo[]> {
    const includeHidden = options?.includeHidden === true;
    const visibilityFilter = includeHidden
      ? Prisma.empty
      : Prisma.sql`
        WHERE "Oculto" = FALSE
          AND (
            "IdPadre" IS NULL
            OR NOT EXISTS (
              SELECT 1
              FROM "Modulos" parent
              WHERE parent."IdModulo" = "Modulos"."IdPadre"
                AND parent."Oculto" = TRUE
            )
          )
      `;

    const rows = await this.prisma.$queryRaw<ModuloRow[]>(Prisma.sql`
      SELECT
        "IdModulo",
        "Codigo",
        "NombreModulo",
        "Icono",
        "Ruta",
        "IdPadre",
        "OrderIndex",
        "Oculto"
      FROM "Modulos"
      ${visibilityFilter}
      ORDER BY "OrderIndex" ASC, "IdModulo" ASC
    `);

    return rows.map(toDomain);
  }

  async findHiddenIds(ids: number[]): Promise<number[]> {
    if (ids.length === 0) {
      return [];
    }

    const rows = await this.prisma.modulo.findMany({
      where: {
        idModulo: { in: ids },
        oculto: true,
      },
      select: { idModulo: true },
    });

    return rows.map((row) => row.idModulo);
  }

  async findAssignedHiddenIds(idRol: number): Promise<number[]> {
    const rows = await this.prisma.rolModulo.findMany({
      where: {
        idRol,
        modulo: { oculto: true },
      },
      select: { idModulo: true },
    });

    return rows.map((row) => row.idModulo);
  }

  async enableByIds(ids: number[]): Promise<void> {
    if (ids.length === 0) {
      return;
    }

    await this.prisma.modulo.updateMany({
      where: {
        idModulo: { in: ids },
        oculto: true,
      },
      data: { oculto: false },
    });
  }
}
