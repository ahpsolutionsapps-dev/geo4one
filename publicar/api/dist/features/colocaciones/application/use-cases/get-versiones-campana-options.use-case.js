"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVersionesCampanaOptionsUseCase = void 0;
class GetVersionesCampanaOptionsUseCase {
    colocaciones;
    constructor(colocaciones) {
        this.colocaciones = colocaciones;
    }
    async execute() {
        return this.colocaciones.findVersionesCampanaOptions();
    }
}
exports.GetVersionesCampanaOptionsUseCase = GetVersionesCampanaOptionsUseCase;
//# sourceMappingURL=get-versiones-campana-options.use-case.js.map