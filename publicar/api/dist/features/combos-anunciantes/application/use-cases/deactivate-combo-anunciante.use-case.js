"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeactivateComboAnuncianteUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class DeactivateComboAnuncianteUseCase {
    combosAnunciantes;
    constructor(combosAnunciantes) {
        this.combosAnunciantes = combosAnunciantes;
    }
    async execute(idComboAnunciante, actualizadoPor) {
        const existing = await this.combosAnunciantes.findById(idComboAnunciante);
        if (!existing) {
            throw new app_error_1.NotFoundError('Combo de anunciante no encontrado');
        }
        await this.combosAnunciantes.deactivate(idComboAnunciante, actualizadoPor);
    }
}
exports.DeactivateComboAnuncianteUseCase = DeactivateComboAnuncianteUseCase;
//# sourceMappingURL=deactivate-combo-anunciante.use-case.js.map