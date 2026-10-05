"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnularElementoUseCase = void 0;
class AnularElementoUseCase {
    elementos;
    constructor(elementos) {
        this.elementos = elementos;
    }
    async execute(idElemento, idUsuarioAnula) {
        return this.elementos.softDelete(idElemento, idUsuarioAnula);
    }
}
exports.AnularElementoUseCase = AnularElementoUseCase;
//# sourceMappingURL=anular-elemento.use-case.js.map