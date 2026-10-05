"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubSectorIndustrialUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class UpdateSubSectorIndustrialUseCase {
    subSectoresIndustriales;
    sectoresIndustriales;
    constructor(subSectoresIndustriales, sectoresIndustriales) {
        this.subSectoresIndustriales = subSectoresIndustriales;
        this.sectoresIndustriales = sectoresIndustriales;
    }
    async execute(idSubSectorIndustrial, input) {
        const existing = await this.subSectoresIndustriales.findById(idSubSectorIndustrial);
        if (!existing) {
            throw new app_error_1.NotFoundError('Sub sector industrial no encontrado');
        }
        const existingData = existing.toPrimitives();
        const nextSectorIndustrial = input.idSectorIndustrial ?? existingData.idSectorIndustrial;
        const nextSubSectorIndustrial = input.subSectorIndustrial?.trim() ?? existingData.subSectorIndustrial;
        if (input.idSectorIndustrial !== undefined) {
            const sectorIndustrial = await this.sectoresIndustriales.findById(input.idSectorIndustrial);
            if (!sectorIndustrial) {
                throw new app_error_1.NotFoundError('Sector industrial no encontrado');
            }
        }
        const byName = await this.subSectoresIndustriales.findByNombreInSector(nextSectorIndustrial, nextSubSectorIndustrial);
        if (byName && byName.toPrimitives().idSubSectorIndustrial !== idSubSectorIndustrial) {
            throw new app_error_1.ConflictError('Ya existe un sub sector industrial con ese nombre en ese sector');
        }
        const updated = await this.subSectoresIndustriales.update(idSubSectorIndustrial, {
            idSectorIndustrial: input.idSectorIndustrial,
            subSectorIndustrial: input.subSectorIndustrial?.trim(),
            activo: input.activo,
            actualizadoPor: input.actualizadoPor,
        });
        return updated.toPrimitives();
    }
}
exports.UpdateSubSectorIndustrialUseCase = UpdateSubSectorIndustrialUseCase;
//# sourceMappingURL=update-sub-sector-industrial.use-case.js.map