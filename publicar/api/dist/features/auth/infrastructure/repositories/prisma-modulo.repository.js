"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaModuloRepository = void 0;
const client_1 = require("@prisma/client");
const modulo_1 = require("../../domain/entities/modulo");
function toDomain(row) {
    return new modulo_1.Modulo({
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
class PrismaModuloRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByRolId(idRol, options) {
        const includeHidden = options?.includeHidden === true;
        const assignedHiddenFilter = includeHidden
            ? client_1.Prisma.empty
            : client_1.Prisma.sql `AND m."Oculto" = FALSE`;
        const parentHiddenFilter = includeHidden
            ? client_1.Prisma.empty
            : client_1.Prisma.sql `WHERE parent."Oculto" = FALSE`;
        const rows = await this.prisma.$queryRaw(client_1.Prisma.sql `
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
    async findAll(options) {
        const includeHidden = options?.includeHidden === true;
        const visibilityFilter = includeHidden
            ? client_1.Prisma.empty
            : client_1.Prisma.sql `
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
        const rows = await this.prisma.$queryRaw(client_1.Prisma.sql `
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
    async findHiddenIds(ids) {
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
    async findAssignedHiddenIds(idRol) {
        const rows = await this.prisma.rolModulo.findMany({
            where: {
                idRol,
                modulo: { oculto: true },
            },
            select: { idModulo: true },
        });
        return rows.map((row) => row.idModulo);
    }
    async enableByIds(ids) {
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
exports.PrismaModuloRepository = PrismaModuloRepository;
//# sourceMappingURL=prisma-modulo.repository.js.map