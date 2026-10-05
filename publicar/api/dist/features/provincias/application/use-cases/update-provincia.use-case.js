"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProvinciaUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class UpdateProvinciaUseCase {
    provincias;
    constructor(provincias) {
        this.provincias = provincias;
    }
    async execute(idProvincia, input) {
        const existing = await this.provincias.findById(idProvincia);
        if (!existing) {
            throw new app_error_1.NotFoundError('Provincia no encontrada');
        }
        const updated = await this.provincias.update(idProvincia, {
            provincia: input.provincia?.trim(),
            latitud: input.latitud,
            longitud: input.longitud,
            activo: input.activo,
            actualizadoPor: input.actualizadoPor,
        });
        return updated.toPrimitives();
    }
}
exports.UpdateProvinciaUseCase = UpdateProvinciaUseCase;
//# sourceMappingURL=update-provincia.use-case.js.map