"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSubSectoresIndustrialesUseCase = void 0;
class GetSubSectoresIndustrialesUseCase {
    subSectoresIndustriales;
    constructor(subSectoresIndustriales) {
        this.subSectoresIndustriales = subSectoresIndustriales;
    }
    async execute() {
        const rows = await this.subSectoresIndustriales.findMany();
        return rows.map((row) => row.toPrimitives());
    }
}
exports.GetSubSectoresIndustrialesUseCase = GetSubSectoresIndustrialesUseCase;
//# sourceMappingURL=get-sub-sectores-industriales.use-case.js.map