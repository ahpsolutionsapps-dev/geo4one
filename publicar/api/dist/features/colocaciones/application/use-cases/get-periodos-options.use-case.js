"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPeriodosOptionsUseCase = void 0;
class GetPeriodosOptionsUseCase {
    colocaciones;
    constructor(colocaciones) {
        this.colocaciones = colocaciones;
    }
    async execute() {
        return this.colocaciones.findPeriodosOptions();
    }
}
exports.GetPeriodosOptionsUseCase = GetPeriodosOptionsUseCase;
//# sourceMappingURL=get-periodos-options.use-case.js.map