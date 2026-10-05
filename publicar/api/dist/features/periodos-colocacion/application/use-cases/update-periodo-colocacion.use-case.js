"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePeriodoColocacionUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class UpdatePeriodoColocacionUseCase {
    periodosColocacion;
    constructor(periodosColocacion) {
        this.periodosColocacion = periodosColocacion;
    }
    async execute(idPeriodoColocacion, input) {
        const existing = await this.periodosColocacion.findById(idPeriodoColocacion);
        if (!existing) {
            throw new app_error_1.NotFoundError('Periodo de colocacion no encontrado');
        }
        const existingData = existing.toPrimitives();
        const nextFechaInicial = input.fechaInicial ?? existingData.fechaInicial;
        const nextFechaFinal = input.fechaFinal ?? existingData.fechaFinal;
        if (nextFechaFinal < nextFechaInicial) {
            throw new app_error_1.ValidationError('La fecha final no puede ser menor que la fecha inicial');
        }
        const updated = await this.periodosColocacion.update(idPeriodoColocacion, {
            fechaInicial: input.fechaInicial,
            fechaFinal: input.fechaFinal,
            generalesSeguimiento: input.generalesSeguimiento,
            activo: input.activo,
            actualizadoPor: input.actualizadoPor,
        });
        return updated.toPrimitives();
    }
}
exports.UpdatePeriodoColocacionUseCase = UpdatePeriodoColocacionUseCase;
//# sourceMappingURL=update-periodo-colocacion.use-case.js.map