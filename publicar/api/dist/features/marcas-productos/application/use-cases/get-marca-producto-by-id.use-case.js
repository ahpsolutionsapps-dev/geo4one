"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMarcaProductoByIdUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class GetMarcaProductoByIdUseCase {
    marcasProductos;
    constructor(marcasProductos) {
        this.marcasProductos = marcasProductos;
    }
    async execute(idMarcaProducto) {
        const marcaProducto = await this.marcasProductos.findById(idMarcaProducto);
        if (!marcaProducto) {
            throw new app_error_1.NotFoundError('Marca / producto no encontrado');
        }
        return marcaProducto.toPrimitives();
    }
}
exports.GetMarcaProductoByIdUseCase = GetMarcaProductoByIdUseCase;
//# sourceMappingURL=get-marca-producto-by-id.use-case.js.map