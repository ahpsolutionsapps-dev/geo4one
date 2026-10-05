"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetElementosOptionsUseCase = void 0;
class GetElementosOptionsUseCase {
    colocaciones;
    constructor(colocaciones) {
        this.colocaciones = colocaciones;
    }
    async execute() {
        return this.colocaciones.findElementosOptions();
    }
}
exports.GetElementosOptionsUseCase = GetElementosOptionsUseCase;
//# sourceMappingURL=get-elementos-options.use-case.js.map