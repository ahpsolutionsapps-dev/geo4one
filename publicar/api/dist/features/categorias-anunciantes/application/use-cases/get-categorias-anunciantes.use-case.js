"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCategoriasAnunciantesUseCase = void 0;
class GetCategoriasAnunciantesUseCase {
    categoriasAnunciantes;
    constructor(categoriasAnunciantes) {
        this.categoriasAnunciantes = categoriasAnunciantes;
    }
    async execute() {
        const rows = await this.categoriasAnunciantes.findMany();
        return rows.map((row) => row.toPrimitives());
    }
}
exports.GetCategoriasAnunciantesUseCase = GetCategoriasAnunciantesUseCase;
//# sourceMappingURL=get-categorias-anunciantes.use-case.js.map