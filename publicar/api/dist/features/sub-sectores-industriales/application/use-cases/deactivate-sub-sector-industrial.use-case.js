"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeactivateSubSectorIndustrialUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class DeactivateSubSectorIndustrialUseCase {
    subSectoresIndustriales;
    constructor(subSectoresIndustriales) {
        this.subSectoresIndustriales = subSectoresIndustriales;
    }
    async execute(idSubSectorIndustrial, actualizadoPor) {
        const existing = await this.subSectoresIndustriales.findById(idSubSectorIndustrial);
        if (!existing) {
            throw new app_error_1.NotFoundError('Sub sector industrial no encontrado');
        }
        await this.subSectoresIndustriales.deactivate(idSubSectorIndustrial, actualizadoPor);
    }
}
exports.DeactivateSubSectorIndustrialUseCase = DeactivateSubSectorIndustrialUseCase;
//# sourceMappingURL=deactivate-sub-sector-industrial.use-case.js.map