"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSectorIndustrialUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class UpdateSectorIndustrialUseCase {
    sectoresIndustriales;
    constructor(sectoresIndustriales) {
        this.sectoresIndustriales = sectoresIndustriales;
    }
    async execute(idSectorIndustrial, input) {
        const existing = await this.sectoresIndustriales.findById(idSectorIndustrial);
        if (!existing) {
            throw new app_error_1.NotFoundError('Sector industrial no encontrado');
        }
        const existingData = existing.toPrimitives();
        const nextSectorIndustrial = input.sectorIndustrial?.trim() ?? existingData.sectorIndustrial;
        if (input.sectorIndustrial !== undefined) {
            const byName = await this.sectoresIndustriales.findByNombre(nextSectorIndustrial);
            if (byName && byName.toPrimitives().idSectorIndustrial !== idSectorIndustrial) {
                throw new app_error_1.ConflictError('Ya existe un sector industrial con ese nombre');
            }
        }
        const updated = await this.sectoresIndustriales.update(idSectorIndustrial, {
            sectorIndustrial: input.sectorIndustrial?.trim(),
            activo: input.activo,
            actualizadoPor: input.actualizadoPor,
        });
        return updated.toPrimitives();
    }
}
exports.UpdateSectorIndustrialUseCase = UpdateSectorIndustrialUseCase;
//# sourceMappingURL=update-sector-industrial.use-case.js.map