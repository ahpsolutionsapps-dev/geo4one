"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSubSectorIndustrialUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class CreateSubSectorIndustrialUseCase {
    subSectoresIndustriales;
    sectoresIndustriales;
    constructor(subSectoresIndustriales, sectoresIndustriales) {
        this.subSectoresIndustriales = subSectoresIndustriales;
        this.sectoresIndustriales = sectoresIndustriales;
    }
    async execute(input) {
        const subSectorIndustrial = input.subSectorIndustrial.trim();
        const sectorIndustrial = await this.sectoresIndustriales.findById(input.idSectorIndustrial);
        if (!sectorIndustrial) {
            throw new app_error_1.NotFoundError('Sector industrial no encontrado');
        }
        const existing = await this.subSectoresIndustriales.findByNombreInSector(input.idSectorIndustrial, subSectorIndustrial);
        if (existing) {
            throw new app_error_1.ConflictError('Ya existe un sub sector industrial con ese nombre en ese sector');
        }
        const created = await this.subSectoresIndustriales.create({
            idSectorIndustrial: input.idSectorIndustrial,
            subSectorIndustrial,
            creadoPor: input.creadoPor,
        });
        return created.toPrimitives();
    }
}
exports.CreateSubSectorIndustrialUseCase = CreateSubSectorIndustrialUseCase;
//# sourceMappingURL=create-sub-sector-industrial.use-case.js.map