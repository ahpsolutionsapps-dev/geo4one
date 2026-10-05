"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMarcaAguaSeguimientoByIdUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class GetMarcaAguaSeguimientoByIdUseCase {
    marcasAguaSeguimiento;
    constructor(marcasAguaSeguimiento) {
        this.marcasAguaSeguimiento = marcasAguaSeguimiento;
    }
    async execute(idFirmaMarcaAguaSeguimiento) {
        const marcaAgua = await this.marcasAguaSeguimiento.findById(idFirmaMarcaAguaSeguimiento);
        if (!marcaAgua) {
            throw new app_error_1.NotFoundError('Marca de agua no encontrada');
        }
        return marcaAgua.toPrimitives();
    }
}
exports.GetMarcaAguaSeguimientoByIdUseCase = GetMarcaAguaSeguimientoByIdUseCase;
//# sourceMappingURL=get-marca-agua-seguimiento-by-id.use-case.js.map