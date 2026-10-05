"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateElementoUseCase = void 0;
class CreateElementoUseCase {
    elementos;
    constructor(elementos) {
        this.elementos = elementos;
    }
    async execute(input) {
        return this.elementos.create(input);
    }
}
exports.CreateElementoUseCase = CreateElementoUseCase;
//# sourceMappingURL=create-elemento.use-case.js.map