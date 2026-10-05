"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProvinciaUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class CreateProvinciaUseCase {
    provincias;
    constructor(provincias) {
        this.provincias = provincias;
    }
    async execute(input) {
        const provincia = input.provincia.trim();
        const existing = await this.provincias.findByNombre(provincia);
        if (existing) {
            throw new app_error_1.ConflictError('Ya existe una provincia con ese nombre');
        }
        const created = await this.provincias.create({
            provincia,
            latitud: input.latitud ?? null,
            longitud: input.longitud ?? null,
            creadoPor: input.creadoPor,
        });
        return created.toPrimitives();
    }
}
exports.CreateProvinciaUseCase = CreateProvinciaUseCase;
//# sourceMappingURL=create-provincia.use-case.js.map