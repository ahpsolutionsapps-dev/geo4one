"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSubSectorIndustrialByIdUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class GetSubSectorIndustrialByIdUseCase {
    subSectoresIndustriales;
    constructor(subSectoresIndustriales) {
        this.subSectoresIndustriales = subSectoresIndustriales;
    }
    async execute(idSubSectorIndustrial) {
        const subSectorIndustrial = await this.subSectoresIndustriales.findById(idSubSectorIndustrial);
        if (!subSectorIndustrial) {
            throw new app_error_1.NotFoundError('Sub sector industrial no encontrado');
        }
        return subSectorIndustrial.toPrimitives();
    }
}
exports.GetSubSectorIndustrialByIdUseCase = GetSubSectorIndustrialByIdUseCase;
//# sourceMappingURL=get-sub-sector-industrial-by-id.use-case.js.map