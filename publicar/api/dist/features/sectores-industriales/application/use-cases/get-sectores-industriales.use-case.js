"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSectoresIndustrialesUseCase = void 0;
class GetSectoresIndustrialesUseCase {
    sectoresIndustriales;
    constructor(sectoresIndustriales) {
        this.sectoresIndustriales = sectoresIndustriales;
    }
    async execute() {
        const rows = await this.sectoresIndustriales.findMany();
        return rows.map((row) => row.toPrimitives());
    }
}
exports.GetSectoresIndustrialesUseCase = GetSectoresIndustrialesUseCase;
//# sourceMappingURL=get-sectores-industriales.use-case.js.map