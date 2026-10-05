"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSectorIndustrialByIdUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class GetSectorIndustrialByIdUseCase {
    sectoresIndustriales;
    constructor(sectoresIndustriales) {
        this.sectoresIndustriales = sectoresIndustriales;
    }
    async execute(idSectorIndustrial) {
        const sectorIndustrial = await this.sectoresIndustriales.findById(idSectorIndustrial);
        if (!sectorIndustrial) {
            throw new app_error_1.NotFoundError('Sector industrial no encontrado');
        }
        return sectorIndustrial.toPrimitives();
    }
}
exports.GetSectorIndustrialByIdUseCase = GetSectorIndustrialByIdUseCase;
//# sourceMappingURL=get-sector-industrial-by-id.use-case.js.map