"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeactivateProveedorUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class DeactivateProveedorUseCase {
    proveedores;
    constructor(proveedores) {
        this.proveedores = proveedores;
    }
    async execute(idProveedor, actualizadoPor) {
        const existing = await this.proveedores.findById(idProveedor);
        if (!existing) {
            throw new app_error_1.NotFoundError('Suplidor no encontrado');
        }
        await this.proveedores.deactivate(idProveedor, actualizadoPor);
    }
}
exports.DeactivateProveedorUseCase = DeactivateProveedorUseCase;
//# sourceMappingURL=deactivate-proveedor.use-case.js.map