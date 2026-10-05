"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeactivateSectorUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class DeactivateSectorUseCase {
    sectores;
    constructor(sectores) {
        this.sectores = sectores;
    }
    async execute(idSectorBarrio, actualizadoPor) {
        const existing = await this.sectores.findById(idSectorBarrio);
        if (!existing) {
            throw new app_error_1.NotFoundError('Sector no encontrado');
        }
        await this.sectores.deactivate(idSectorBarrio, actualizadoPor);
    }
}
exports.DeactivateSectorUseCase = DeactivateSectorUseCase;
//# sourceMappingURL=deactivate-sector.use-case.js.map