"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeactivateProvinciaUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class DeactivateProvinciaUseCase {
    provincias;
    constructor(provincias) {
        this.provincias = provincias;
    }
    async execute(idProvincia, actualizadoPor) {
        const existing = await this.provincias.findById(idProvincia);
        if (!existing) {
            throw new app_error_1.NotFoundError('Provincia no encontrada');
        }
        await this.provincias.deactivate(idProvincia, actualizadoPor);
    }
}
exports.DeactivateProvinciaUseCase = DeactivateProvinciaUseCase;
//# sourceMappingURL=deactivate-provincia.use-case.js.map