"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCategoriaAnuncianteByIdUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class GetCategoriaAnuncianteByIdUseCase {
    categoriasAnunciantes;
    constructor(categoriasAnunciantes) {
        this.categoriasAnunciantes = categoriasAnunciantes;
    }
    async execute(idCategoriaAnunciante) {
        const categoriaAnunciante = await this.categoriasAnunciantes.findById(idCategoriaAnunciante);
        if (!categoriaAnunciante) {
            throw new app_error_1.NotFoundError('Categoría de anunciante no encontrada');
        }
        return categoriaAnunciante.toPrimitives();
    }
}
exports.GetCategoriaAnuncianteByIdUseCase = GetCategoriaAnuncianteByIdUseCase;
//# sourceMappingURL=get-categoria-anunciante-by-id.use-case.js.map