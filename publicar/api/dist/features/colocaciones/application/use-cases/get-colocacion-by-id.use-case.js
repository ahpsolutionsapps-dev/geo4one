"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetColocacionByIdUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class GetColocacionByIdUseCase {
    colocaciones;
    constructor(colocaciones) {
        this.colocaciones = colocaciones;
    }
    async execute(idColocacion) {
        const item = await this.colocaciones.findById(idColocacion);
        if (!item) {
            throw new app_error_1.NotFoundError('Colocacion no encontrada');
        }
        return item.toPrimitives();
    }
}
exports.GetColocacionByIdUseCase = GetColocacionByIdUseCase;
//# sourceMappingURL=get-colocacion-by-id.use-case.js.map