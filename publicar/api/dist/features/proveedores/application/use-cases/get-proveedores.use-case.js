"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProveedoresUseCase = void 0;
class GetProveedoresUseCase {
    proveedores;
    constructor(proveedores) {
        this.proveedores = proveedores;
    }
    async execute() {
        const items = await this.proveedores.findMany();
        return items.map((item) => item.toPrimitives());
    }
}
exports.GetProveedoresUseCase = GetProveedoresUseCase;
//# sourceMappingURL=get-proveedores.use-case.js.map