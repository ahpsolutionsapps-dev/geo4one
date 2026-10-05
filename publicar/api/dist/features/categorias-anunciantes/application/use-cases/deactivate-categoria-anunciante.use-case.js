"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeactivateCategoriaAnuncianteUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class DeactivateCategoriaAnuncianteUseCase {
    categoriasAnunciantes;
    constructor(categoriasAnunciantes) {
        this.categoriasAnunciantes = categoriasAnunciantes;
    }
    async execute(idCategoriaAnunciante, actualizadoPor) {
        const existing = await this.categoriasAnunciantes.findById(idCategoriaAnunciante);
        if (!existing) {
            throw new app_error_1.NotFoundError('Categoría de anunciante no encontrada');
        }
        await this.categoriasAnunciantes.deactivate(idCategoriaAnunciante, actualizadoPor);
    }
}
exports.DeactivateCategoriaAnuncianteUseCase = DeactivateCategoriaAnuncianteUseCase;
//# sourceMappingURL=deactivate-categoria-anunciante.use-case.js.map