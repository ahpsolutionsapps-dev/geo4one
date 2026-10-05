"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProveedorByIdUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class GetProveedorByIdUseCase {
    proveedores;
    constructor(proveedores) {
        this.proveedores = proveedores;
    }
    async execute(idProveedor) {
        const item = await this.proveedores.findById(idProveedor);
        if (!item) {
            throw new app_error_1.NotFoundError('Suplidor no encontrado');
        }
        return item.toPrimitives();
    }
}
exports.GetProveedorByIdUseCase = GetProveedorByIdUseCase;
//# sourceMappingURL=get-proveedor-by-id.use-case.js.map