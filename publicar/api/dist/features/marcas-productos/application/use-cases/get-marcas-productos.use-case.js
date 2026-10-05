"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMarcasProductosUseCase = void 0;
class GetMarcasProductosUseCase {
    marcasProductos;
    constructor(marcasProductos) {
        this.marcasProductos = marcasProductos;
    }
    async execute() {
        const rows = await this.marcasProductos.findMany();
        return rows.map((row) => row.toPrimitives());
    }
}
exports.GetMarcasProductosUseCase = GetMarcasProductosUseCase;
//# sourceMappingURL=get-marcas-productos.use-case.js.map