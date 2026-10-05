"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaSubSectorIndustrialRepository = void 0;
const sub_sector_industrial_1 = require("../../domain/entities/sub-sector-industrial");
function mapRow(row) {
    return new sub_sector_industrial_1.SubSectorIndustrial({
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
class PrismaSubSectorIndustrialRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany() {
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
    async findById(idSubSectorIndustrial) {
        const row = await this.prisma.subSectoresIndustriales.findUnique({
            where: { IdSubSectorIndustrial: BigInt(idSubSectorIndustrial) },
            include: {
                SectoresIndustriales: { select: { SectorIndustrial: true } },
            },
        });
        return row ? mapRow(row) : null;
    }
    async findByNombreInSector(idSectorIndustrial, subSectorIndustrial) {
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
    async create(input) {
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
    async update(idSubSectorIndustrial, input) {
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
    async deactivate(idSubSectorIndustrial, actualizadoPor) {
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
exports.PrismaSubSectorIndustrialRepository = PrismaSubSectorIndustrialRepository;
//# sourceMappingURL=prisma-sub-sector-industrial.repository.js.map