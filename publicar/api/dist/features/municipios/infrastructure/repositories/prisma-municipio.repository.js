"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaMunicipioRepository = void 0;
const municipio_1 = require("../../domain/entities/municipio");
function mapRow(row) {
    return new municipio_1.Municipio({
        idMunicipio: Number(row.IdMunicipio),
        idProvincia: Number(row.IdProvincia),
        provinciaNombre: row.Provincias.Provincia,
        municipio: row.Municipio,
        latitud: row.Latitud === null ? null : Number(row.Latitud),
        longitud: row.Longitud === null ? null : Number(row.Longitud),
        activo: row.Activo,
        fechaCreacion: row.FechaCreacion,
        fechaActualizacion: row.FechaActualizacion,
        creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
        actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
    });
}
class PrismaMunicipioRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany() {
        const rows = await this.prisma.municipios.findMany({
            include: { Provincias: { select: { Provincia: true } } },
            orderBy: [{ Provincias: { Provincia: 'asc' } }, { Municipio: 'asc' }],
        });
        return rows.map(mapRow);
    }
    async findById(idMunicipio) {
        const row = await this.prisma.municipios.findUnique({
            where: { IdMunicipio: BigInt(idMunicipio) },
            include: { Provincias: { select: { Provincia: true } } },
        });
        return row ? mapRow(row) : null;
    }
    async findByNombreInProvincia(idProvincia, municipio) {
        const row = await this.prisma.municipios.findFirst({
            where: { IdProvincia: BigInt(idProvincia), Municipio: municipio },
            include: { Provincias: { select: { Provincia: true } } },
        });
        return row ? mapRow(row) : null;
    }
    async create(input) {
        const row = await this.prisma.municipios.create({
            data: {
                IdProvincia: BigInt(input.idProvincia),
                Municipio: input.municipio,
                Latitud: input.latitud ?? null,
                Longitud: input.longitud ?? null,
                Activo: true,
                FechaCreacion: new Date(),
                FechaActualizacion: new Date(),
                CreadoPor: BigInt(input.creadoPor),
                ActualizadoPor: BigInt(input.creadoPor),
            },
            include: { Provincias: { select: { Provincia: true } } },
        });
        return mapRow(row);
    }
    async update(idMunicipio, input) {
        const row = await this.prisma.municipios.update({
            where: { IdMunicipio: BigInt(idMunicipio) },
            data: {
                ...(input.idProvincia !== undefined ? { IdProvincia: BigInt(input.idProvincia) } : {}),
                ...(input.municipio !== undefined ? { Municipio: input.municipio } : {}),
                ...(input.latitud !== undefined ? { Latitud: input.latitud } : {}),
                ...(input.longitud !== undefined ? { Longitud: input.longitud } : {}),
                ...(input.activo !== undefined ? { Activo: input.activo } : {}),
                FechaActualizacion: new Date(),
                ActualizadoPor: BigInt(input.actualizadoPor),
            },
            include: { Provincias: { select: { Provincia: true } } },
        });
        return mapRow(row);
    }
    async deactivate(idMunicipio, actualizadoPor) {
        await this.prisma.municipios.update({
            where: { IdMunicipio: BigInt(idMunicipio) },
            data: {
                Activo: false,
                FechaActualizacion: new Date(),
                ActualizadoPor: BigInt(actualizadoPor),
            },
        });
    }
}
exports.PrismaMunicipioRepository = PrismaMunicipioRepository;
//# sourceMappingURL=prisma-municipio.repository.js.map