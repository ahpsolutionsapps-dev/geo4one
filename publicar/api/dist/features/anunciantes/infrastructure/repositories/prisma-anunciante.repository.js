"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaAnuncianteRepository = void 0;
const anunciante_1 = require("../../domain/entities/anunciante");
function mapRow(row) {
    return new anunciante_1.Anunciante({
        idAnunciante: Number(row.IdAnunciante),
        idSectorIndustrial: Number(row.IdSectorIndustrial),
        sectorIndustrial: row.SectoresIndustriales.SectorIndustrial,
        idSubSectorIndustrial: Number(row.IdSubSectorIndustrial),
        subSectorIndustrial: row.SubSectoresIndustriales.SubSectorIndustrial,
        idCategoriaAnunciante: Number(row.IdCategoriaAnunciante),
        categoriaAnunciante: row.CategoriasAnunciantes.CategoriaAnunciante,
        anunciante: row.Anunciante,
        activo: row.Activo,
        fechaCreacion: row.FechaCreacion,
        fechaActualizacion: row.FechaActualizacion,
        creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
        actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
    });
}
class PrismaAnuncianteRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany() {
        const rows = await this.prisma.anunciantes.findMany({
            include: {
                SectoresIndustriales: { select: { SectorIndustrial: true } },
                SubSectoresIndustriales: { select: { SubSectorIndustrial: true } },
                CategoriasAnunciantes: { select: { CategoriaAnunciante: true } },
            },
            orderBy: [
                { SectoresIndustriales: { SectorIndustrial: 'asc' } },
                { SubSectoresIndustriales: { SubSectorIndustrial: 'asc' } },
                { CategoriasAnunciantes: { CategoriaAnunciante: 'asc' } },
                { Anunciante: 'asc' },
            ],
        });
        return rows.map(mapRow);
    }
    async findById(idAnunciante) {
        const row = await this.prisma.anunciantes.findUnique({
            where: { IdAnunciante: BigInt(idAnunciante) },
            include: {
                SectoresIndustriales: { select: { SectorIndustrial: true } },
                SubSectoresIndustriales: { select: { SubSectorIndustrial: true } },
                CategoriasAnunciantes: { select: { CategoriaAnunciante: true } },
            },
        });
        return row ? mapRow(row) : null;
    }
    async findByNombreInCategoria(idCategoriaAnunciante, anunciante) {
        const row = await this.prisma.anunciantes.findFirst({
            where: {
                IdCategoriaAnunciante: BigInt(idCategoriaAnunciante),
                Anunciante: anunciante,
            },
            include: {
                SectoresIndustriales: { select: { SectorIndustrial: true } },
                SubSectoresIndustriales: { select: { SubSectorIndustrial: true } },
                CategoriasAnunciantes: { select: { CategoriaAnunciante: true } },
            },
        });
        return row ? mapRow(row) : null;
    }
    async findSectorById(idSectorIndustrial) {
        const row = await this.prisma.sectoresIndustriales.findUnique({
            where: { IdSectorIndustrial: BigInt(idSectorIndustrial) },
            select: {
                IdSectorIndustrial: true,
                SectorIndustrial: true,
                Activo: true,
            },
        });
        if (!row) {
            return null;
        }
        return {
            idSectorIndustrial: Number(row.IdSectorIndustrial),
            sectorIndustrial: row.SectorIndustrial,
            activo: row.Activo,
        };
    }
    async findSubSectorById(idSubSectorIndustrial) {
        const row = await this.prisma.subSectoresIndustriales.findUnique({
            where: { IdSubSectorIndustrial: BigInt(idSubSectorIndustrial) },
            select: {
                IdSubSectorIndustrial: true,
                IdSectorIndustrial: true,
                SubSectorIndustrial: true,
                Activo: true,
            },
        });
        if (!row) {
            return null;
        }
        return {
            idSubSectorIndustrial: Number(row.IdSubSectorIndustrial),
            idSectorIndustrial: Number(row.IdSectorIndustrial),
            subSectorIndustrial: row.SubSectorIndustrial,
            activo: row.Activo,
        };
    }
    async findCategoriaById(idCategoriaAnunciante) {
        const row = await this.prisma.categoriasAnunciantes.findUnique({
            where: { IdCategoriaAnunciante: BigInt(idCategoriaAnunciante) },
            select: {
                IdCategoriaAnunciante: true,
                IdSectorIndustrial: true,
                IdSubSectorIndustrial: true,
                CategoriaAnunciante: true,
                Activo: true,
            },
        });
        if (!row) {
            return null;
        }
        return {
            idCategoriaAnunciante: Number(row.IdCategoriaAnunciante),
            idSectorIndustrial: Number(row.IdSectorIndustrial),
            idSubSectorIndustrial: Number(row.IdSubSectorIndustrial),
            categoriaAnunciante: row.CategoriaAnunciante,
            activo: row.Activo,
        };
    }
    async findSectoresOptions() {
        const rows = await this.prisma.sectoresIndustriales.findMany({
            where: { Activo: true },
            select: {
                IdSectorIndustrial: true,
                SectorIndustrial: true,
            },
            orderBy: [{ SectorIndustrial: 'asc' }],
        });
        return rows.map((row) => ({
            idSectorIndustrial: Number(row.IdSectorIndustrial),
            sectorIndustrial: row.SectorIndustrial,
        }));
    }
    async findSubSectoresOptions(idSectorIndustrial) {
        const rows = await this.prisma.subSectoresIndustriales.findMany({
            where: {
                Activo: true,
                ...(idSectorIndustrial !== undefined
                    ? { IdSectorIndustrial: BigInt(idSectorIndustrial) }
                    : {}),
            },
            select: {
                IdSubSectorIndustrial: true,
                IdSectorIndustrial: true,
                SubSectorIndustrial: true,
            },
            orderBy: [{ SubSectorIndustrial: 'asc' }],
        });
        return rows.map((row) => ({
            idSubSectorIndustrial: Number(row.IdSubSectorIndustrial),
            idSectorIndustrial: Number(row.IdSectorIndustrial),
            subSectorIndustrial: row.SubSectorIndustrial,
        }));
    }
    async findCategoriasOptions(idSubSectorIndustrial) {
        const rows = await this.prisma.categoriasAnunciantes.findMany({
            where: {
                Activo: true,
                ...(idSubSectorIndustrial !== undefined
                    ? { IdSubSectorIndustrial: BigInt(idSubSectorIndustrial) }
                    : {}),
            },
            select: {
                IdCategoriaAnunciante: true,
                IdSectorIndustrial: true,
                IdSubSectorIndustrial: true,
                CategoriaAnunciante: true,
            },
            orderBy: [{ CategoriaAnunciante: 'asc' }],
        });
        return rows.map((row) => ({
            idCategoriaAnunciante: Number(row.IdCategoriaAnunciante),
            idSectorIndustrial: Number(row.IdSectorIndustrial),
            idSubSectorIndustrial: Number(row.IdSubSectorIndustrial),
            categoriaAnunciante: row.CategoriaAnunciante,
        }));
    }
    async create(input) {
        const row = await this.prisma.anunciantes.create({
            data: {
                IdSectorIndustrial: BigInt(input.idSectorIndustrial),
                IdSubSectorIndustrial: BigInt(input.idSubSectorIndustrial),
                IdCategoriaAnunciante: BigInt(input.idCategoriaAnunciante),
                Anunciante: input.anunciante,
                Activo: true,
                FechaCreacion: new Date(),
                FechaActualizacion: new Date(),
                CreadoPor: BigInt(input.creadoPor),
                ActualizadoPor: BigInt(input.creadoPor),
            },
            include: {
                SectoresIndustriales: { select: { SectorIndustrial: true } },
                SubSectoresIndustriales: { select: { SubSectorIndustrial: true } },
                CategoriasAnunciantes: { select: { CategoriaAnunciante: true } },
            },
        });
        return mapRow(row);
    }
    async update(idAnunciante, input) {
        const row = await this.prisma.anunciantes.update({
            where: { IdAnunciante: BigInt(idAnunciante) },
            data: {
                ...(input.idSectorIndustrial !== undefined
                    ? { IdSectorIndustrial: BigInt(input.idSectorIndustrial) }
                    : {}),
                ...(input.idSubSectorIndustrial !== undefined
                    ? { IdSubSectorIndustrial: BigInt(input.idSubSectorIndustrial) }
                    : {}),
                ...(input.idCategoriaAnunciante !== undefined
                    ? { IdCategoriaAnunciante: BigInt(input.idCategoriaAnunciante) }
                    : {}),
                ...(input.anunciante !== undefined ? { Anunciante: input.anunciante } : {}),
                ...(input.activo !== undefined ? { Activo: input.activo } : {}),
                FechaActualizacion: new Date(),
                ActualizadoPor: BigInt(input.actualizadoPor),
            },
            include: {
                SectoresIndustriales: { select: { SectorIndustrial: true } },
                SubSectoresIndustriales: { select: { SubSectorIndustrial: true } },
                CategoriasAnunciantes: { select: { CategoriaAnunciante: true } },
            },
        });
        return mapRow(row);
    }
    async deactivate(idAnunciante, actualizadoPor) {
        await this.prisma.anunciantes.update({
            where: { IdAnunciante: BigInt(idAnunciante) },
            data: {
                Activo: false,
                FechaActualizacion: new Date(),
                ActualizadoPor: BigInt(actualizadoPor),
            },
        });
    }
}
exports.PrismaAnuncianteRepository = PrismaAnuncianteRepository;
//# sourceMappingURL=prisma-anunciante.repository.js.map