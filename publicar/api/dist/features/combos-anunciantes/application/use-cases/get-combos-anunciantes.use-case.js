"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCombosAnunciantesUseCase = void 0;
class GetCombosAnunciantesUseCase {
    combosAnunciantes;
    constructor(combosAnunciantes) {
        this.combosAnunciantes = combosAnunciantes;
    }
    async execute() {
        const rows = await this.combosAnunciantes.findMany();
        return rows.map((row) => row.toPrimitives());
    }
}
exports.GetCombosAnunciantesUseCase = GetCombosAnunciantesUseCase;
//# sourceMappingURL=get-combos-anunciantes.use-case.js.map