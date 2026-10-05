"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaVersionCampanaRepository = void 0;
const version_campana_1 = require("../../domain/entities/version-campana");
function mapRow(row) {
    return new version_campana_1.VersionCampana({
        idVersionCampana: Number(row.IdVersionCampana),
        idAnunciante: Number(row.IdAnunciante),
        anunciante: row.Anunciantes.Anunciante,
        idMarcaProducto: row.IdMarcaProducto === null ? null : Number(row.IdMarcaProducto),
        marcaProducto: row.MarcasProductos?.MarcaProducto ?? null,
        idComboAnunciante: row.IdComboAnunciante === null ? null : Number(row.IdComboAnunciante),
        comboAnunciante: row.CombosAnunciantes?.ComboAnunciante ?? null,
        versionCampana: row.VersionCampana,
        leyendaSeguimiento: row.LeyendaSeguimiento,
        activo: row.Activo,
        anulado: row.Anulado,
        fechaAnulacion: row.FechaAnulacion,
        fechaCreacion: row.FechaCreacion,
        fechaActualizacion: row.FechaActualizacion,
        creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
        actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
    });
}
class PrismaVersionCampanaRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany() {
        const rows = await this.prisma.versionesCampanas.findMany({
            include: {
                Anunciantes: { select: { Anunciante: true } },
                MarcasProductos: { select: { MarcaProducto: true } },
                CombosAnunciantes: { select: { ComboAnunciante: true } },
            },
            orderBy: [{ Anunciantes: { Anunciante: 'asc' } }, { VersionCampana: 'asc' }],
        });
        return rows.map(mapRow);
    }
    async findById(idVersionCampana) {
        const row = await this.prisma.versionesCampanas.findUnique({
            where: { IdVersionCampana: BigInt(idVersionCampana) },
            include: {
                Anunciantes: { select: { Anunciante: true } },
                MarcasProductos: { select: { MarcaProducto: true } },
                CombosAnunciantes: { select: { ComboAnunciante: true } },
            },
        });
        return row ? mapRow(row) : null;
    }
    async findByNombreInAnunciante(idAnunciante, versionCampana) {
        const row = await this.prisma.versionesCampanas.findFirst({
            where: {
                IdAnunciante: BigInt(idAnunciante),
                VersionCampana: versionCampana,
            },
            include: {
                Anunciantes: { select: { Anunciante: true } },
                MarcasProductos: { select: { MarcaProducto: true } },
                CombosAnunciantes: { select: { ComboAnunciante: true } },
            },
        });
        return row ? mapRow(row) : null;
    }
    async findAnuncianteById(idAnunciante) {
        const row = await this.prisma.anunciantes.findUnique({
            where: { IdAnunciante: BigInt(idAnunciante) },
            select: {
                IdAnunciante: true,
                Anunciante: true,
                Activo: true,
            },
        });
        if (!row) {
            return null;
        }
        return {
            idAnunciante: Number(row.IdAnunciante),
            anunciante: row.Anunciante,
            activo: row.Activo,
        };
    }
    async findMarcaProductoById(idMarcaProducto) {
        const row = await this.prisma.marcasProductos.findUnique({
            where: { IdMarcaProducto: BigInt(idMarcaProducto) },
            select: {
                IdMarcaProducto: true,
                IdAnunciante: true,
                MarcaProducto: true,
                Activo: true,
            },
        });
        if (!row) {
            return null;
        }
        return {
            idMarcaProducto: Number(row.IdMarcaProducto),
            idAnunciante: Number(row.IdAnunciante),
            marcaProducto: row.MarcaProducto,
            activo: row.Activo,
        };
    }
    async findComboAnuncianteById(idComboAnunciante) {
        const row = await this.prisma.combosAnunciantes.findUnique({
            where: { IdComboAnunciante: BigInt(idComboAnunciante) },
            select: {
                IdComboAnunciante: true,
                ComboAnunciante: true,
                Activo: true,
            },
        });
        if (!row) {
            return null;
        }
        return {
            idComboAnunciante: Number(row.IdComboAnunciante),
            comboAnunciante: row.ComboAnunciante,
            activo: row.Activo,
        };
    }
    async findAnunciantesOptions() {
        const rows = await this.prisma.anunciantes.findMany({
            where: { Activo: true },
            select: {
                IdAnunciante: true,
                Anunciante: true,
            },
            orderBy: [{ Anunciante: 'asc' }],
        });
        return rows.map((row) => ({
            idAnunciante: Number(row.IdAnunciante),
            anunciante: row.Anunciante,
        }));
    }
    async findMarcasProductosOptions(idAnunciante) {
        const rows = await this.prisma.marcasProductos.findMany({
            where: {
                Activo: true,
                ...(idAnunciante !== undefined ? { IdAnunciante: BigInt(idAnunciante) } : {}),
            },
            select: {
                IdMarcaProducto: true,
                IdAnunciante: true,
                MarcaProducto: true,
                Anunciantes: { select: { Anunciante: true } },
            },
            orderBy: [{ MarcaProducto: 'asc' }],
        });
        return rows.map((row) => ({
            idMarcaProducto: Number(row.IdMarcaProducto),
            idAnunciante: Number(row.IdAnunciante),
            marcaProducto: row.MarcaProducto,
            anunciante: row.Anunciantes.Anunciante,
        }));
    }
    async findCombosAnunciantesOptions() {
        const rows = await this.prisma.combosAnunciantes.findMany({
            where: { Activo: true },
            select: {
                IdComboAnunciante: true,
                ComboAnunciante: true,
            },
            orderBy: [{ ComboAnunciante: 'asc' }],
        });
        return rows.map((row) => ({
            idComboAnunciante: Number(row.IdComboAnunciante),
            comboAnunciante: row.ComboAnunciante,
        }));
    }
    async create(input) {
        const row = await this.prisma.versionesCampanas.create({
            data: {
                IdAnunciante: BigInt(input.idAnunciante),
                IdMarcaProducto: input.idMarcaProducto === null ? null : input.idMarcaProducto !== undefined ? BigInt(input.idMarcaProducto) : null,
                IdComboAnunciante: input.idComboAnunciante === null
                    ? null
                    : input.idComboAnunciante !== undefined
                        ? BigInt(input.idComboAnunciante)
                        : null,
                VersionCampana: input.versionCampana,
                LeyendaSeguimiento: input.leyendaSeguimiento ?? null,
                Activo: true,
                Anulado: false,
                FechaCreacion: new Date(),
                FechaActualizacion: new Date(),
                CreadoPor: BigInt(input.creadoPor),
                ActualizadoPor: BigInt(input.creadoPor),
            },
            include: {
                Anunciantes: { select: { Anunciante: true } },
                MarcasProductos: { select: { MarcaProducto: true } },
                CombosAnunciantes: { select: { ComboAnunciante: true } },
            },
        });
        return mapRow(row);
    }
    async update(idVersionCampana, input) {
        const row = await this.prisma.versionesCampanas.update({
            where: { IdVersionCampana: BigInt(idVersionCampana) },
            data: {
                ...(input.idAnunciante !== undefined ? { IdAnunciante: BigInt(input.idAnunciante) } : {}),
                ...(input.idMarcaProducto !== undefined
                    ? {
                        IdMarcaProducto: input.idMarcaProducto === null ? null : BigInt(input.idMarcaProducto),
                    }
                    : {}),
                ...(input.idComboAnunciante !== undefined
                    ? {
                        IdComboAnunciante: input.idComboAnunciante === null ? null : BigInt(input.idComboAnunciante),
                    }
                    : {}),
                ...(input.versionCampana !== undefined ? { VersionCampana: input.versionCampana } : {}),
                ...(input.leyendaSeguimiento !== undefined
                    ? { LeyendaSeguimiento: input.leyendaSeguimiento }
                    : {}),
                ...(input.activo !== undefined ? { Activo: input.activo } : {}),
                FechaActualizacion: new Date(),
                ActualizadoPor: BigInt(input.actualizadoPor),
            },
            include: {
                Anunciantes: { select: { Anunciante: true } },
                MarcasProductos: { select: { MarcaProducto: true } },
                CombosAnunciantes: { select: { ComboAnunciante: true } },
            },
        });
        return mapRow(row);
    }
    async deactivate(idVersionCampana, actualizadoPor) {
        await this.prisma.versionesCampanas.update({
            where: { IdVersionCampana: BigInt(idVersionCampana) },
            data: {
                Activo: false,
                FechaActualizacion: new Date(),
                ActualizadoPor: BigInt(actualizadoPor),
            },
        });
    }
}
exports.PrismaVersionCampanaRepository = PrismaVersionCampanaRepository;
//# sourceMappingURL=prisma-version-campana.repository.js.map