"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVersionesCampanaOptionsUseCase = void 0;
class GetVersionesCampanaOptionsUseCase {
    marcasAguaSeguimiento;
    constructor(marcasAguaSeguimiento) {
        this.marcasAguaSeguimiento = marcasAguaSeguimiento;
    }
    async execute() {
        return this.marcasAguaSeguimiento.findVersionCampanaOptions();
    }
}
exports.GetVersionesCampanaOptionsUseCase = GetVersionesCampanaOptionsUseCase;
//# sourceMappingURL=get-versiones-campana-options.use-case.js.map