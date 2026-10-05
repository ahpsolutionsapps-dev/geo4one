"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeactivateSectorIndustrialUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class DeactivateSectorIndustrialUseCase {
    sectoresIndustriales;
    constructor(sectoresIndustriales) {
        this.sectoresIndustriales = sectoresIndustriales;
    }
    async execute(idSectorIndustrial, actualizadoPor) {
        const existing = await this.sectoresIndustriales.findById(idSectorIndustrial);
        if (!existing) {
            throw new app_error_1.NotFoundError('Sector industrial no encontrado');
        }
        await this.sectoresIndustriales.deactivate(idSectorIndustrial, actualizadoPor);
    }
}
exports.DeactivateSectorIndustrialUseCase = DeactivateSectorIndustrialUseCase;
//# sourceMappingURL=deactivate-sector-industrial.use-case.js.map