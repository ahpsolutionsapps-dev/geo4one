"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaMarcaAguaSeguimientoRepository = void 0;
const marca_agua_seguimiento_1 = require("../../domain/entities/marca-agua-seguimiento");
function mapRow(row) {
    return new marca_agua_seguimiento_1.MarcaAguaSeguimiento({
        idFirmaMarcaAguaSeguimiento: Number(row.IdFirmaMarcaAguaSeguimiento),
        idVersionCampana: Number(row.IdVersionCampana),
        versionCampana: row.VersionesCampanas.VersionCampana,
        anunciante: row.VersionesCampanas.Anunciantes.Anunciante,
        imagenMuestra: row.ImagenMuestra,
        videoMuestra: row.VideoMuestra,
        activo: row.Activo,
        fechaCreacion: row.FechaCreacion,
        fechaActualizacion: row.FechaActualizacion,
        creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
        actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
    });
}
class PrismaMarcaAguaSeguimientoRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany() {
        const rows = await this.prisma.firmasMarcasAguaSeguimiento.findMany({
            include: {
                VersionesCampanas: {
                    select: {
                        VersionCampana: true,
                        Anunciantes: { select: { Anunciante: true } },
                    },
                },
            },
            orderBy: [{ VersionesCampanas: { VersionCampana: 'asc' } }, { FechaCreacion: 'desc' }],
        });
        return rows.map(mapRow);
    }
    async findById(idFirmaMarcaAguaSeguimiento) {
        const row = await this.prisma.firmasMarcasAguaSeguimiento.findUnique({
            where: { IdFirmaMarcaAguaSeguimiento: BigInt(idFirmaMarcaAguaSeguimiento) },
            include: {
                VersionesCampanas: {
                    select: {
                        VersionCampana: true,
                        Anunciantes: { select: { Anunciante: true } },
                    },
                },
            },
        });
        return row ? mapRow(row) : null;
    }
    async findVersionCampanaById(idVersionCampana) {
        const row = await this.prisma.versionesCampanas.findUnique({
            where: { IdVersionCampana: BigInt(idVersionCampana) },
            select: {
                IdVersionCampana: true,
                VersionCampana: true,
                Activo: true,
                Anulado: true,
                Anunciantes: { select: { Anunciante: true } },
            },
        });
        if (!row) {
            return null;
        }
        return {
            idVersionCampana: Number(row.IdVersionCampana),
            versionCampana: row.VersionCampana,
            anunciante: row.Anunciantes.Anunciante,
            activo: row.Activo,
            anulado: row.Anulado,
        };
    }
    async findVersionCampanaOptions() {
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
    async create(input) {
        const row = await this.prisma.firmasMarcasAguaSeguimiento.create({
            data: {
                IdVersionCampana: BigInt(input.idVersionCampana),
                ImagenMuestra: input.imagenMuestra ?? null,
                VideoMuestra: input.videoMuestra ?? null,
                Activo: true,
                FechaCreacion: new Date(),
                FechaActualizacion: new Date(),
                CreadoPor: BigInt(input.creadoPor),
                ActualizadoPor: BigInt(input.creadoPor),
            },
            include: {
                VersionesCampanas: {
                    select: {
                        VersionCampana: true,
                        Anunciantes: { select: { Anunciante: true } },
                    },
                },
            },
        });
        return mapRow(row);
    }
    async update(idFirmaMarcaAguaSeguimiento, input) {
        const row = await this.prisma.firmasMarcasAguaSeguimiento.update({
            where: { IdFirmaMarcaAguaSeguimiento: BigInt(idFirmaMarcaAguaSeguimiento) },
            data: {
                ...(input.idVersionCampana !== undefined
                    ? { IdVersionCampana: BigInt(input.idVersionCampana) }
                    : {}),
                ...(input.imagenMuestra !== undefined ? { ImagenMuestra: input.imagenMuestra } : {}),
                ...(input.videoMuestra !== undefined ? { VideoMuestra: input.videoMuestra } : {}),
                ...(input.activo !== undefined ? { Activo: input.activo } : {}),
                FechaActualizacion: new Date(),
                ActualizadoPor: BigInt(input.actualizadoPor),
            },
            include: {
                VersionesCampanas: {
                    select: {
                        VersionCampana: true,
                        Anunciantes: { select: { Anunciante: true } },
                    },
                },
            },
        });
        return mapRow(row);
    }
    async deactivate(idFirmaMarcaAguaSeguimiento, actualizadoPor) {
        await this.prisma.firmasMarcasAguaSeguimiento.update({
            where: { IdFirmaMarcaAguaSeguimiento: BigInt(idFirmaMarcaAguaSeguimiento) },
            data: {
                Activo: false,
                FechaActualizacion: new Date(),
                ActualizadoPor: BigInt(actualizadoPor),
            },
        });
    }
}
exports.PrismaMarcaAguaSeguimientoRepository = PrismaMarcaAguaSeguimientoRepository;
//# sourceMappingURL=prisma-marca-agua-seguimiento.repository.js.map