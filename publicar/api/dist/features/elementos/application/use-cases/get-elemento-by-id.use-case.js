"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetElementoByIdUseCase = void 0;
class GetElementoByIdUseCase {
    elementos;
    constructor(elementos) {
        this.elementos = elementos;
    }
    async execute(idElemento) {
        return this.elementos.findById(idElemento);
    }
}
exports.GetElementoByIdUseCase = GetElementoByIdUseCase;
//# sourceMappingURL=get-elemento-by-id.use-case.js.map