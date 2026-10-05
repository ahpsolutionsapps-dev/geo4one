"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCategoriasAnunciantesOptionsUseCase = void 0;
class GetCategoriasAnunciantesOptionsUseCase {
    anunciantes;
    constructor(anunciantes) {
        this.anunciantes = anunciantes;
    }
    async execute(idSubSectorIndustrial) {
        return this.anunciantes.findCategoriasOptions(idSubSectorIndustrial);
    }
}
exports.GetCategoriasAnunciantesOptionsUseCase = GetCategoriasAnunciantesOptionsUseCase;
//# sourceMappingURL=get-categorias-anunciantes-options.use-case.js.map