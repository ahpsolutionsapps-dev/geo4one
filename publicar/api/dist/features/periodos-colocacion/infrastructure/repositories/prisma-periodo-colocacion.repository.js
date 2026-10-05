"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPeriodoColocacionRepository = void 0;
const periodo_colocacion_1 = require("../../domain/entities/periodo-colocacion");
function mapRow(row) {
    return new periodo_colocacion_1.PeriodoColocacion({
        idPeriodoColocacion: Number(row.IdPeriodoColocacion),
        fechaInicial: row.FechaInicial,
        fechaFinal: row.FechaFinal,
        generalesSeguimiento: row.GeneralesSeguimiento,
        activo: row.Activo,
        fechaCreacion: row.FechaCreacion,
        fechaActualizacion: row.FechaActualizacion,
        creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
        actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
    });
}
class PrismaPeriodoColocacionRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany() {
        const rows = await this.prisma.periodosColocacion.findMany({
            orderBy: [{ FechaInicial: 'desc' }, { FechaFinal: 'desc' }],
        });
        return rows.map(mapRow);
    }
    async findById(idPeriodoColocacion) {
        const row = await this.prisma.periodosColocacion.findUnique({
            where: { IdPeriodoColocacion: BigInt(idPeriodoColocacion) },
        });
        return row ? mapRow(row) : null;
    }
    async create(input) {
        const row = await this.prisma.periodosColocacion.create({
            data: {
                FechaInicial: input.fechaInicial,
                FechaFinal: input.fechaFinal,
                GeneralesSeguimiento: input.generalesSeguimiento ?? null,
                Activo: true,
                FechaCreacion: new Date(),
                FechaActualizacion: new Date(),
                CreadoPor: BigInt(input.creadoPor),
                ActualizadoPor: BigInt(input.creadoPor),
            },
        });
        return mapRow(row);
    }
    async update(idPeriodoColocacion, input) {
        const row = await this.prisma.periodosColocacion.update({
            where: { IdPeriodoColocacion: BigInt(idPeriodoColocacion) },
            data: {
                ...(input.fechaInicial !== undefined ? { FechaInicial: input.fechaInicial } : {}),
                ...(input.fechaFinal !== undefined ? { FechaFinal: input.fechaFinal } : {}),
                ...(input.generalesSeguimiento !== undefined
                    ? { GeneralesSeguimiento: input.generalesSeguimiento }
                    : {}),
                ...(input.activo !== undefined ? { Activo: input.activo } : {}),
                FechaActualizacion: new Date(),
                ActualizadoPor: BigInt(input.actualizadoPor),
            },
        });
        return mapRow(row);
    }
    async deactivate(idPeriodoColocacion, actualizadoPor) {
        await this.prisma.periodosColocacion.update({
            where: { IdPeriodoColocacion: BigInt(idPeriodoColocacion) },
            data: {
                Activo: false,
                FechaActualizacion: new Date(),
                ActualizadoPor: BigInt(actualizadoPor),
            },
        });
    }
}
exports.PrismaPeriodoColocacionRepository = PrismaPeriodoColocacionRepository;
//# sourceMappingURL=prisma-periodo-colocacion.repository.js.map