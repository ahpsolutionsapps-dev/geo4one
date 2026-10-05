"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSectorByIdUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class GetSectorByIdUseCase {
    sectores;
    constructor(sectores) {
        this.sectores = sectores;
    }
    async execute(idSectorBarrio) {
        const sector = await this.sectores.findById(idSectorBarrio);
        if (!sector) {
            throw new app_error_1.NotFoundError('Sector no encontrado');
        }
        return sector.toPrimitives();
    }
}
exports.GetSectorByIdUseCase = GetSectorByIdUseCase;
//# sourceMappingURL=get-sector-by-id.use-case.js.map