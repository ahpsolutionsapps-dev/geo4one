"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaSectorIndustrialRepository = void 0;
const sector_industrial_1 = require("../../domain/entities/sector-industrial");
function mapRow(row) {
    return new sector_industrial_1.SectorIndustrial({
        idSectorIndustrial: Number(row.IdSectorIndustrial),
        sectorIndustrial: row.SectorIndustrial,
        activo: row.Activo,
        fechaCreacion: row.FechaCreacion,
        fechaActualizacion: row.FechaActualizacion,
        creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
        actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
    });
}
class PrismaSectorIndustrialRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany() {
        const rows = await this.prisma.sectoresIndustriales.findMany({
            orderBy: { SectorIndustrial: 'asc' },
        });
        return rows.map(mapRow);
    }
    async findById(idSectorIndustrial) {
        const row = await this.prisma.sectoresIndustriales.findUnique({
            where: { IdSectorIndustrial: BigInt(idSectorIndustrial) },
        });
        return row ? mapRow(row) : null;
    }
    async findByNombre(sectorIndustrial) {
        const row = await this.prisma.sectoresIndustriales.findFirst({
            where: { SectorIndustrial: sectorIndustrial },
        });
        return row ? mapRow(row) : null;
    }
    async create(input) {
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
    async update(idSectorIndustrial, input) {
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
    async deactivate(idSectorIndustrial, actualizadoPor) {
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
exports.PrismaSectorIndustrialRepository = PrismaSectorIndustrialRepository;
//# sourceMappingURL=prisma-sector-industrial.repository.js.map