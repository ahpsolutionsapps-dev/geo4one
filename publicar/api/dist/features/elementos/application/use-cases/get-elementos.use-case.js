"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetElementosUseCase = void 0;
class GetElementosUseCase {
    elementos;
    constructor(elementos) {
        this.elementos = elementos;
    }
    async execute(filters) {
        return this.elementos.findMany(filters);
    }
}
exports.GetElementosUseCase = GetElementosUseCase;
//# sourceMappingURL=get-elementos.use-case.js.map