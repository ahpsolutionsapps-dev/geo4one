"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAnuncianteByIdUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class GetAnuncianteByIdUseCase {
    anunciantes;
    constructor(anunciantes) {
        this.anunciantes = anunciantes;
    }
    async execute(idAnunciante) {
        const item = await this.anunciantes.findById(idAnunciante);
        if (!item) {
            throw new app_error_1.NotFoundError('Anunciante no encontrado');
        }
        return item.toPrimitives();
    }
}
exports.GetAnuncianteByIdUseCase = GetAnuncianteByIdUseCase;
//# sourceMappingURL=get-anunciante-by-id.use-case.js.map