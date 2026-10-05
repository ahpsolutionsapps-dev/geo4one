"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetComboMarcasOptionsUseCase = void 0;
class GetComboMarcasOptionsUseCase {
    combosAnunciantes;
    constructor(combosAnunciantes) {
        this.combosAnunciantes = combosAnunciantes;
    }
    async execute() {
        return this.combosAnunciantes.findMarcaProductoOptions();
    }
}
exports.GetComboMarcasOptionsUseCase = GetComboMarcasOptionsUseCase;
//# sourceMappingURL=get-combo-marcas-options.use-case.js.map