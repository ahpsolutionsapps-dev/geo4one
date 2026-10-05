"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeactivateMarcaProductoUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class DeactivateMarcaProductoUseCase {
    marcasProductos;
    constructor(marcasProductos) {
        this.marcasProductos = marcasProductos;
    }
    async execute(idMarcaProducto, actualizadoPor) {
        const existing = await this.marcasProductos.findById(idMarcaProducto);
        if (!existing) {
            throw new app_error_1.NotFoundError('Marca / producto no encontrado');
        }
        await this.marcasProductos.deactivate(idMarcaProducto, actualizadoPor);
    }
}
exports.DeactivateMarcaProductoUseCase = DeactivateMarcaProductoUseCase;
//# sourceMappingURL=deactivate-marca-producto.use-case.js.map