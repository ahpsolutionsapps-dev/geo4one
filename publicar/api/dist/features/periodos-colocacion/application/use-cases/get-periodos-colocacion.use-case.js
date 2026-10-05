"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPeriodosColocacionUseCase = void 0;
class GetPeriodosColocacionUseCase {
    periodosColocacion;
    constructor(periodosColocacion) {
        this.periodosColocacion = periodosColocacion;
    }
    async execute() {
        const rows = await this.periodosColocacion.findMany();
        return rows.map((row) => row.toPrimitives());
    }
}
exports.GetPeriodosColocacionUseCase = GetPeriodosColocacionUseCase;
//# sourceMappingURL=get-periodos-colocacion.use-case.js.map