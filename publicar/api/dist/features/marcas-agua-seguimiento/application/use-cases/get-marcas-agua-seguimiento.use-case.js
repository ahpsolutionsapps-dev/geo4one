"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMarcasAguaSeguimientoUseCase = void 0;
class GetMarcasAguaSeguimientoUseCase {
    marcasAguaSeguimiento;
    constructor(marcasAguaSeguimiento) {
        this.marcasAguaSeguimiento = marcasAguaSeguimiento;
    }
    async execute() {
        const rows = await this.marcasAguaSeguimiento.findMany();
        return rows.map((row) => row.toPrimitives());
    }
}
exports.GetMarcasAguaSeguimientoUseCase = GetMarcasAguaSeguimientoUseCase;
//# sourceMappingURL=get-marcas-agua-seguimiento.use-case.js.map