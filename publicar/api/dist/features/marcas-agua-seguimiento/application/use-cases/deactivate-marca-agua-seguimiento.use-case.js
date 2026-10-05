"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeactivateMarcaAguaSeguimientoUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class DeactivateMarcaAguaSeguimientoUseCase {
    marcasAguaSeguimiento;
    constructor(marcasAguaSeguimiento) {
        this.marcasAguaSeguimiento = marcasAguaSeguimiento;
    }
    async execute(idFirmaMarcaAguaSeguimiento, actualizadoPor) {
        const existing = await this.marcasAguaSeguimiento.findById(idFirmaMarcaAguaSeguimiento);
        if (!existing) {
            throw new app_error_1.NotFoundError('Marca de agua no encontrada');
        }
        await this.marcasAguaSeguimiento.deactivate(idFirmaMarcaAguaSeguimiento, actualizadoPor);
    }
}
exports.DeactivateMarcaAguaSeguimientoUseCase = DeactivateMarcaAguaSeguimientoUseCase;
//# sourceMappingURL=deactivate-marca-agua-seguimiento.use-case.js.map