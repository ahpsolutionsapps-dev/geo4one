"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeactivatePeriodoColocacionUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class DeactivatePeriodoColocacionUseCase {
    periodosColocacion;
    constructor(periodosColocacion) {
        this.periodosColocacion = periodosColocacion;
    }
    async execute(idPeriodoColocacion, actualizadoPor) {
        const existing = await this.periodosColocacion.findById(idPeriodoColocacion);
        if (!existing) {
            throw new app_error_1.NotFoundError('Periodo de colocacion no encontrado');
        }
        await this.periodosColocacion.deactivate(idPeriodoColocacion, actualizadoPor);
    }
}
exports.DeactivatePeriodoColocacionUseCase = DeactivatePeriodoColocacionUseCase;
//# sourceMappingURL=deactivate-periodo-colocacion.use-case.js.map