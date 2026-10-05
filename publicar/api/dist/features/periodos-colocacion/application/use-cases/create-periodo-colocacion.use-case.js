"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePeriodoColocacionUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class CreatePeriodoColocacionUseCase {
    periodosColocacion;
    constructor(periodosColocacion) {
        this.periodosColocacion = periodosColocacion;
    }
    async execute(input) {
        if (input.fechaFinal < input.fechaInicial) {
            throw new app_error_1.ValidationError('La fecha final no puede ser menor que la fecha inicial');
        }
        const created = await this.periodosColocacion.create({
            fechaInicial: input.fechaInicial,
            fechaFinal: input.fechaFinal,
            generalesSeguimiento: input.generalesSeguimiento,
            creadoPor: input.creadoPor,
        });
        return created.toPrimitives();
    }
}
exports.CreatePeriodoColocacionUseCase = CreatePeriodoColocacionUseCase;
//# sourceMappingURL=create-periodo-colocacion.use-case.js.map