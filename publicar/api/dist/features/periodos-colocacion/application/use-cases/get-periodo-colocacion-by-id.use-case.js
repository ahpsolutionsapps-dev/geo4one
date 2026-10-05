"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPeriodoColocacionByIdUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class GetPeriodoColocacionByIdUseCase {
    periodosColocacion;
    constructor(periodosColocacion) {
        this.periodosColocacion = periodosColocacion;
    }
    async execute(idPeriodoColocacion) {
        const periodoColocacion = await this.periodosColocacion.findById(idPeriodoColocacion);
        if (!periodoColocacion) {
            throw new app_error_1.NotFoundError('Periodo de colocacion no encontrado');
        }
        return periodoColocacion.toPrimitives();
    }
}
exports.GetPeriodoColocacionByIdUseCase = GetPeriodoColocacionByIdUseCase;
//# sourceMappingURL=get-periodo-colocacion-by-id.use-case.js.map