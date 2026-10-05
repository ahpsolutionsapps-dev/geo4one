"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetComboAnuncianteByIdUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class GetComboAnuncianteByIdUseCase {
    combosAnunciantes;
    constructor(combosAnunciantes) {
        this.combosAnunciantes = combosAnunciantes;
    }
    async execute(idComboAnunciante) {
        const comboAnunciante = await this.combosAnunciantes.findById(idComboAnunciante);
        if (!comboAnunciante) {
            throw new app_error_1.NotFoundError('Combo de anunciante no encontrado');
        }
        return comboAnunciante.toPrimitives();
    }
}
exports.GetComboAnuncianteByIdUseCase = GetComboAnuncianteByIdUseCase;
//# sourceMappingURL=get-combo-anunciante-by-id.use-case.js.map