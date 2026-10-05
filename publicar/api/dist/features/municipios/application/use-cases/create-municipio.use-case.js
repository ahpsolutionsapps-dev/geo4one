"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMunicipioUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class CreateMunicipioUseCase {
    municipios;
    provincias;
    constructor(municipios, provincias) {
        this.municipios = municipios;
        this.provincias = provincias;
    }
    async execute(input) {
        const municipio = input.municipio.trim();
        const province = await this.provincias.findById(input.idProvincia);
        if (!province) {
            throw new app_error_1.NotFoundError('Provincia no encontrada');
        }
        const existing = await this.municipios.findByNombreInProvincia(input.idProvincia, municipio);
        if (existing) {
            throw new app_error_1.ConflictError('Ya existe un municipio con ese nombre en esa provincia');
        }
        const created = await this.municipios.create({
            idProvincia: input.idProvincia,
            municipio,
            latitud: input.latitud ?? null,
            longitud: input.longitud ?? null,
            creadoPor: input.creadoPor,
        });
        return created.toPrimitives();
    }
}
exports.CreateMunicipioUseCase = CreateMunicipioUseCase;
//# sourceMappingURL=create-municipio.use-case.js.map