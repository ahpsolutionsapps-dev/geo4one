"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaProvinciaRepository = void 0;
const provincia_1 = require("../../domain/entities/provincia");
class PrismaProvinciaRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany() {
        const rows = await this.prisma.provincias.findMany({
            orderBy: { Provincia: 'asc' },
        });
        return rows.map((row) => new provincia_1.Provincia({
            idProvincia: Number(row.IdProvincia),
            provincia: row.Provincia,
            latitud: row.Latitud === null ? null : Number(row.Latitud),
            longitud: row.Longitud === null ? null : Number(row.Longitud),
            activo: row.Activo,
            fechaCreacion: row.FechaCreacion,
            fechaActualizacion: row.FechaActualizacion,
            creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
            actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
        }));
    }
    async findById(idProvincia) {
        const row = await this.prisma.provincias.findUnique({
            where: { IdProvincia: BigInt(idProvincia) },
        });
        if (!row) {
            return null;
        }
        return new provincia_1.Provincia({
            idProvincia: Number(row.IdProvincia),
            provincia: row.Provincia,
            latitud: row.Latitud === null ? null : Number(row.Latitud),
            longitud: row.Longitud === null ? null : Number(row.Longitud),
            activo: row.Activo,
            fechaCreacion: row.FechaCreacion,
            fechaActualizacion: row.FechaActualizacion,
            creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
            actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
        });
    }
    async findByNombre(provincia) {
        const row = await this.prisma.provincias.findFirst({
            where: { Provincia: provincia },
        });
        if (!row) {
            return null;
        }
        return new provincia_1.Provincia({
            idProvincia: Number(row.IdProvincia),
            provincia: row.Provincia,
            latitud: row.Latitud === null ? null : Number(row.Latitud),
            longitud: row.Longitud === null ? null : Number(row.Longitud),
            activo: row.Activo,
            fechaCreacion: row.FechaCreacion,
            fechaActualizacion: row.FechaActualizacion,
            creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
            actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
        });
    }
    async create(input) {
        const row = await this.prisma.provincias.create({
            data: {
                Provincia: input.provincia,
                Latitud: input.latitud ?? null,
                Longitud: input.longitud ?? null,
                Activo: true,
                FechaCreacion: new Date(),
                FechaActualizacion: new Date(),
                CreadoPor: BigInt(input.creadoPor),
                ActualizadoPor: BigInt(input.creadoPor),
            },
        });
        return new provincia_1.Provincia({
            idProvincia: Number(row.IdProvincia),
            provincia: row.Provincia,
            latitud: row.Latitud === null ? null : Number(row.Latitud),
            longitud: row.Longitud === null ? null : Number(row.Longitud),
            activo: row.Activo,
            fechaCreacion: row.FechaCreacion,
            fechaActualizacion: row.FechaActualizacion,
            creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
            actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
        });
    }
    async update(idProvincia, input) {
        const row = await this.prisma.provincias.update({
            where: { IdProvincia: BigInt(idProvincia) },
            data: {
                ...(input.provincia !== undefined ? { Provincia: input.provincia } : {}),
                ...(input.latitud !== undefined ? { Latitud: input.latitud } : {}),
                ...(input.longitud !== undefined ? { Longitud: input.longitud } : {}),
                ...(input.activo !== undefined ? { Activo: input.activo } : {}),
                FechaActualizacion: new Date(),
                ActualizadoPor: BigInt(input.actualizadoPor),
            },
        });
        return new provincia_1.Provincia({
            idProvincia: Number(row.IdProvincia),
            provincia: row.Provincia,
            latitud: row.Latitud === null ? null : Number(row.Latitud),
            longitud: row.Longitud === null ? null : Number(row.Longitud),
            activo: row.Activo,
            fechaCreacion: row.FechaCreacion,
            fechaActualizacion: row.FechaActualizacion,
            creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
            actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
        });
    }
    async deactivate(idProvincia, actualizadoPor) {
        await this.prisma.provincias.update({
            where: { IdProvincia: BigInt(idProvincia) },
            data: {
                Activo: false,
                FechaActualizacion: new Date(),
                ActualizadoPor: BigInt(actualizadoPor),
            },
        });
    }
}
exports.PrismaProvinciaRepository = PrismaProvinciaRepository;
//# sourceMappingURL=prisma-provincia.repository.js.map