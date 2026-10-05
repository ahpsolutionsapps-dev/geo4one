"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProvinciasUseCase = void 0;
class GetProvinciasUseCase {
    provincias;
    constructor(provincias) {
        this.provincias = provincias;
    }
    async execute() {
        const rows = await this.provincias.findMany();
        return rows.map((row) => row.toPrimitives());
    }
}
exports.GetProvinciasUseCase = GetProvinciasUseCase;
//# sourceMappingURL=get-provincias.use-case.js.map