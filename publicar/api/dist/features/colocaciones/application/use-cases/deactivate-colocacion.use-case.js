"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeactivateColocacionUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class DeactivateColocacionUseCase {
    colocaciones;
    constructor(colocaciones) {
        this.colocaciones = colocaciones;
    }
    async execute(idColocacion, actualizadoPor) {
        const existing = await this.colocaciones.findById(idColocacion);
        if (!existing) {
            throw new app_error_1.NotFoundError('Colocacion no encontrada');
        }
        await this.colocaciones.deactivate(idColocacion, actualizadoPor);
    }
}
exports.DeactivateColocacionUseCase = DeactivateColocacionUseCase;
//# sourceMappingURL=deactivate-colocacion.use-case.js.map