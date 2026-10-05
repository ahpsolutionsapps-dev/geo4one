"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaColocacionRepository = void 0;
const colocacion_1 = require("../../domain/entities/colocacion");
function buildElementoLabel(row) {
    return row.IdSeguimiento || row.Licencia || `Elemento #${String(row.IdElemento)}`;
}
function formatPeriodo(fechaInicial, fechaFinal) {
    const start = fechaInicial.toISOString().slice(0, 10);
    const end = fechaFinal.toISOString().slice(0, 10);
    return `${start} - ${end}`;
}
function mapRow(row) {
    return new colocacion_1.Colocacion({
        idColocacion: Number(row.IdColocacion),
        codigoSeguimiento: row.CodigoSeguimiento,
        idElemento: Number(row.IdElemento),
        elemento: buildElementoLabel(row.Elementos),
        idVersionCampana: Number(row.IdVersionCampana),
        versionCampana: row.VersionesCampanas.VersionCampana,
        anunciante: row.VersionesCampanas.Anunciantes.Anunciante,
        idPeriodoColocacion: Number(row.IdPeriodoColocacion),
        periodo: formatPeriodo(row.PeriodosColocacion.FechaInicial, row.PeriodosColocacion.FechaFinal),
        observaciones: row.Observaciones,
        activo: row.Activo,
        anulado: row.Anulado,
        fechaAnulacion: row.FechaAnulacion,
        fechaCreacion: row.FechaCreacion,
        fechaActualizacion: row.FechaActualizacion,
        creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
        actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
    });
}
class PrismaColocacionRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany() {
        const rows = await this.prisma.colocaciones.findMany({
            include: {
                Elementos: { select: { IdElemento: true, IdSeguimiento: true, Licencia: true } },
                VersionesCampanas: {
                    select: {
                        VersionCampana: true,
                        Anunciantes: { select: { Anunciante: true } },
                    },
                },
                PeriodosColocacion: { select: { FechaInicial: true, FechaFinal: true } },
            },
            orderBy: [{ FechaCreacion: 'desc' }],
        });
        return rows.map(mapRow);
    }
    async findById(idColocacion) {
        const row = await this.prisma.colocaciones.findUnique({
            where: { IdColocacion: BigInt(idColocacion) },
            include: {
                Elementos: { select: { IdElemento: true, IdSeguimiento: true, Licencia: true } },
                VersionesCampanas: {
                    select: {
                        VersionCampana: true,
                        Anunciantes: { select: { Anunciante: true } },
                    },
                },
                PeriodosColocacion: { select: { FechaInicial: true, FechaFinal: true } },
            },
        });
        return row ? mapRow(row) : null;
    }
    async findByCodigoSeguimiento(codigoSeguimiento) {
        const row = await this.prisma.colocaciones.findUnique({
            where: { CodigoSeguimiento: codigoSeguimiento },
            include: {
                Elementos: { select: { IdElemento: true, IdSeguimiento: true, Licencia: true } },
                VersionesCampanas: {
                    select: {
                        VersionCampana: true,
                        Anunciantes: { select: { Anunciante: true } },
                    },
                },
                PeriodosColocacion: { select: { FechaInicial: true, FechaFinal: true } },
            },
        });
        return row ? mapRow(row) : null;
    }
    async findElementoById(idElemento) {
        const row = await this.prisma.elementos.findUnique({
            where: { IdElemento: BigInt(idElemento) },
            select: {
                IdElemento: true,
                IdSeguimiento: true,
                Licencia: true,
                Activo: true,
                Anulado: true,
            },
        });
        if (!row) {
            return null;
        }
        return {
            idElemento: Number(row.IdElemento),
            activo: row.Activo,
            anulado: row.Anulado,
            elemento: buildElementoLabel(row),
        };
    }
    async findVersionCampanaById(idVersionCampana) {
        const row = await this.prisma.versionesCampanas.findUnique({
            where: { IdVersionCampana: BigInt(idVersionCampana) },
            select: {
                IdVersionCampana: true,
                VersionCampana: true,
                Activo: true,
                Anulado: true,
            },
        });
        if (!row) {
            return null;
        }
        return {
            idVersionCampana: Number(row.IdVersionCampana),
            activo: row.Activo,
            anulado: row.Anulado,
            versionCampana: row.VersionCampana,
        };
    }
    async findPeriodoById(idPeriodoColocacion) {
        const row = await this.prisma.periodosColocacion.findUnique({
            where: { IdPeriodoColocacion: BigInt(idPeriodoColocacion) },
            select: {
                IdPeriodoColocacion: true,
                FechaInicial: true,
                FechaFinal: true,
                Activo: true,
            },
        });
        if (!row) {
            return null;
        }
        return {
            idPeriodoColocacion: Number(row.IdPeriodoColocacion),
            fechaInicial: row.FechaInicial,
            fechaFinal: row.FechaFinal,
            activo: row.Activo,
        };
    }
    async findElementosOptions() {
        const rows = await this.prisma.elementos.findMany({
            where: { Activo: true, Anulado: false },
            select: {
                IdElemento: true,
                IdSeguimiento: true,
                Licencia: true,
            },
            orderBy: [{ IdElemento: 'asc' }],
        });
        return rows.map((row) => ({
            idElemento: Number(row.IdElemento),
            elemento: buildElementoLabel(row),
        }));
    }
    async findVersionesCampanaOptions() {
        const rows = await this.prisma.versionesCampanas.findMany({
            where: { Activo: true, Anulado: false },
            select: {
                IdVersionCampana: true,
                VersionCampana: true,
                Anunciantes: { select: { Anunciante: true } },
            },
            orderBy: [{ VersionCampana: 'asc' }],
        });
        return rows.map((row) => ({
            idVersionCampana: Number(row.IdVersionCampana),
            versionCampana: row.VersionCampana,
            anunciante: row.Anunciantes.Anunciante,
        }));
    }
    async findPeriodosOptions() {
        const rows = await this.prisma.periodosColocacion.findMany({
            where: { Activo: true },
            select: {
                IdPeriodoColocacion: true,
                FechaInicial: true,
                FechaFinal: true,
            },
            orderBy: [{ FechaInicial: 'desc' }],
        });
        return rows.map((row) => ({
            idPeriodoColocacion: Number(row.IdPeriodoColocacion),
            fechaInicial: row.FechaInicial,
            fechaFinal: row.FechaFinal,
        }));
    }
    async create(input) {
        const row = await this.prisma.colocaciones.create({
            data: {
                CodigoSeguimiento: input.codigoSeguimiento,
                IdElemento: BigInt(input.idElemento),
                IdVersionCampana: BigInt(input.idVersionCampana),
                IdPeriodoColocacion: BigInt(input.idPeriodoColocacion),
                Observaciones: input.observaciones ?? null,
                Activo: true,
                Anulado: false,
                FechaCreacion: new Date(),
                FechaActualizacion: new Date(),
                CreadoPor: BigInt(input.creadoPor),
                ActualizadoPor: BigInt(input.creadoPor),
            },
            include: {
                Elementos: { select: { IdElemento: true, IdSeguimiento: true, Licencia: true } },
                VersionesCampanas: {
                    select: {
                        VersionCampana: true,
                        Anunciantes: { select: { Anunciante: true } },
                    },
                },
                PeriodosColocacion: { select: { FechaInicial: true, FechaFinal: true } },
            },
        });
        return mapRow(row);
    }
    async update(idColocacion, input) {
        const row = await this.prisma.colocaciones.update({
            where: { IdColocacion: BigInt(idColocacion) },
            data: {
                ...(input.codigoSeguimiento !== undefined
                    ? { CodigoSeguimiento: input.codigoSeguimiento }
                    : {}),
                ...(input.idElemento !== undefined ? { IdElemento: BigInt(input.idElemento) } : {}),
                ...(input.idVersionCampana !== undefined
                    ? { IdVersionCampana: BigInt(input.idVersionCampana) }
                    : {}),
                ...(input.idPeriodoColocacion !== undefined
                    ? { IdPeriodoColocacion: BigInt(input.idPeriodoColocacion) }
                    : {}),
                ...(input.observaciones !== undefined ? { Observaciones: input.observaciones } : {}),
                ...(input.activo !== undefined ? { Activo: input.activo } : {}),
                FechaActualizacion: new Date(),
                ActualizadoPor: BigInt(input.actualizadoPor),
            },
            include: {
                Elementos: { select: { IdElemento: true, IdSeguimiento: true, Licencia: true } },
                VersionesCampanas: {
                    select: {
                        VersionCampana: true,
                        Anunciantes: { select: { Anunciante: true } },
                    },
                },
                PeriodosColocacion: { select: { FechaInicial: true, FechaFinal: true } },
            },
        });
        return mapRow(row);
    }
    async deactivate(idColocacion, actualizadoPor) {
        await this.prisma.colocaciones.update({
            where: { IdColocacion: BigInt(idColocacion) },
            data: {
                Activo: false,
                FechaActualizacion: new Date(),
                ActualizadoPor: BigInt(actualizadoPor),
            },
        });
    }
}
exports.PrismaColocacionRepository = PrismaColocacionRepository;
//# sourceMappingURL=prisma-colocacion.repository.js.map