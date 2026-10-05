"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSectoresUseCase = void 0;
class GetSectoresUseCase {
    sectores;
    constructor(sectores) {
        this.sectores = sectores;
    }
    async execute() {
        const rows = await this.sectores.findMany();
        return rows.map((row) => row.toPrimitives());
    }
}
exports.GetSectoresUseCase = GetSectoresUseCase;
//# sourceMappingURL=get-sectores.use-case.js.map