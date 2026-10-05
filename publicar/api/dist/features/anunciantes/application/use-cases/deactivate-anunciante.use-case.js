"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeactivateAnuncianteUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class DeactivateAnuncianteUseCase {
    anunciantes;
    constructor(anunciantes) {
        this.anunciantes = anunciantes;
    }
    async execute(idAnunciante, actualizadoPor) {
        const existing = await this.anunciantes.findById(idAnunciante);
        if (!existing) {
            throw new app_error_1.NotFoundError('Anunciante no encontrado');
        }
        await this.anunciantes.deactivate(idAnunciante, actualizadoPor);
    }
}
exports.DeactivateAnuncianteUseCase = DeactivateAnuncianteUseCase;
//# sourceMappingURL=deactivate-anunciante.use-case.js.map