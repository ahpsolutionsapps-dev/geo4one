"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateElementoUseCase = void 0;
class UpdateElementoUseCase {
    elementos;
    constructor(elementos) {
        this.elementos = elementos;
    }
    async execute(idElemento, input) {
        return this.elementos.update(idElemento, input);
    }
}
exports.UpdateElementoUseCase = UpdateElementoUseCase;
//# sourceMappingURL=update-elemento.use-case.js.map