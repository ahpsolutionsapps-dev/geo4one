"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaSectorRepository = void 0;
const sector_1 = require("../../domain/entities/sector");
function mapRow(row) {
    return new sector_1.Sector({
        idSectorBarrio: Number(row.IdSectorBarrio),
        idMunicipio: Number(row.IdMunicipio),
        municipioNombre: row.Municipios.Municipio,
        provinciaNombre: row.Municipios.Provincias.Provincia,
        sectorBarrio: row.SectorBarrio,
        circunscripcion: row.Circunscripcion,
        latitud: row.Latitud === null ? null : Number(row.Latitud),
        longitud: row.Longitud === null ? null : Number(row.Longitud),
        activo: row.Activo,
        fechaCreacion: row.FechaCreacion,
        fechaActualizacion: row.FechaActualizacion,
        creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
        actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
    });
}
class PrismaSectorRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany() {
        const rows = await this.prisma.sectoresBarrios.findMany({
            include: {
                Municipios: {
                    select: {
                        Municipio: true,
                        Provincias: { select: { Provincia: true } },
                    },
                },
            },
            orderBy: [
                { Municipios: { Provincias: { Provincia: 'asc' } } },
                { Municipios: { Municipio: 'asc' } },
                { SectorBarrio: 'asc' },
            ],
        });
        return rows.map(mapRow);
    }
    async findById(idSectorBarrio) {
        const row = await this.prisma.sectoresBarrios.findUnique({
            where: { IdSectorBarrio: BigInt(idSectorBarrio) },
            include: {
                Municipios: {
                    select: {
                        Municipio: true,
                        Provincias: { select: { Provincia: true } },
                    },
                },
            },
        });
        return row ? mapRow(row) : null;
    }
    async findByNombreInMunicipio(idMunicipio, sectorBarrio) {
        const row = await this.prisma.sectoresBarrios.findFirst({
            where: { IdMunicipio: BigInt(idMunicipio), SectorBarrio: sectorBarrio },
            include: {
                Municipios: {
                    select: {
                        Municipio: true,
                        Provincias: { select: { Provincia: true } },
                    },
                },
            },
        });
        return row ? mapRow(row) : null;
    }
    async create(input) {
        const row = await this.prisma.sectoresBarrios.create({
            data: {
                IdMunicipio: BigInt(input.idMunicipio),
                SectorBarrio: input.sectorBarrio,
                Circunscripcion: input.circunscripcion ?? null,
                Latitud: input.latitud ?? null,
                Longitud: input.longitud ?? null,
                Activo: true,
                FechaCreacion: new Date(),
                FechaActualizacion: new Date(),
                CreadoPor: BigInt(input.creadoPor),
                ActualizadoPor: BigInt(input.creadoPor),
            },
            include: {
                Municipios: {
                    select: {
                        Municipio: true,
                        Provincias: { select: { Provincia: true } },
                    },
                },
            },
        });
        return mapRow(row);
    }
    async update(idSectorBarrio, input) {
        const row = await this.prisma.sectoresBarrios.update({
            where: { IdSectorBarrio: BigInt(idSectorBarrio) },
            data: {
                ...(input.idMunicipio !== undefined ? { IdMunicipio: BigInt(input.idMunicipio) } : {}),
                ...(input.sectorBarrio !== undefined ? { SectorBarrio: input.sectorBarrio } : {}),
                ...(input.circunscripcion !== undefined ? { Circunscripcion: input.circunscripcion } : {}),
                ...(input.latitud !== undefined ? { Latitud: input.latitud } : {}),
                ...(input.longitud !== undefined ? { Longitud: input.longitud } : {}),
                ...(input.activo !== undefined ? { Activo: input.activo } : {}),
                FechaActualizacion: new Date(),
                ActualizadoPor: BigInt(input.actualizadoPor),
            },
            include: {
                Municipios: {
                    select: {
                        Municipio: true,
                        Provincias: { select: { Provincia: true } },
                    },
                },
            },
        });
        return mapRow(row);
    }
    async deactivate(idSectorBarrio, actualizadoPor) {
        await this.prisma.sectoresBarrios.update({
            where: { IdSectorBarrio: BigInt(idSectorBarrio) },
            data: {
                Activo: false,
                FechaActualizacion: new Date(),
                ActualizadoPor: BigInt(actualizadoPor),
            },
        });
    }
}
exports.PrismaSectorRepository = PrismaSectorRepository;
//# sourceMappingURL=prisma-sector.repository.js.map