"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSectorIndustrialUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class CreateSectorIndustrialUseCase {
    sectoresIndustriales;
    constructor(sectoresIndustriales) {
        this.sectoresIndustriales = sectoresIndustriales;
    }
    async execute(input) {
        const sectorIndustrial = input.sectorIndustrial.trim();
        const existing = await this.sectoresIndustriales.findByNombre(sectorIndustrial);
        if (existing) {
            throw new app_error_1.ConflictError('Ya existe un sector industrial con ese nombre');
        }
        const created = await this.sectoresIndustriales.create({
            sectorIndustrial,
            creadoPor: input.creadoPor,
        });
        return created.toPrimitives();
    }
}
exports.CreateSectorIndustrialUseCase = CreateSectorIndustrialUseCase;
//# sourceMappingURL=create-sector-industrial.use-case.js.map