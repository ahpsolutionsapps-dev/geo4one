"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMunicipiosUseCase = void 0;
class GetMunicipiosUseCase {
    municipios;
    constructor(municipios) {
        this.municipios = municipios;
    }
    async execute() {
        const rows = await this.municipios.findMany();
        return rows.map((row) => row.toPrimitives());
    }
}
exports.GetMunicipiosUseCase = GetMunicipiosUseCase;
//# sourceMappingURL=get-municipios.use-case.js.map