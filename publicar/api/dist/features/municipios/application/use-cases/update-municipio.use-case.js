"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMunicipioUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class UpdateMunicipioUseCase {
    municipios;
    provincias;
    constructor(municipios, provincias) {
        this.municipios = municipios;
        this.provincias = provincias;
    }
    async execute(idMunicipio, input) {
        const existing = await this.municipios.findById(idMunicipio);
        if (!existing) {
            throw new app_error_1.NotFoundError('Municipio no encontrado');
        }
        const existingProps = existing.toPrimitives();
        const nextProvincia = input.idProvincia ?? existingProps.idProvincia;
        const nextMunicipio = input.municipio?.trim() ?? existingProps.municipio;
        if (input.idProvincia !== undefined) {
            const province = await this.provincias.findById(input.idProvincia);
            if (!province) {
                throw new app_error_1.NotFoundError('Provincia no encontrada');
            }
        }
        const byName = await this.municipios.findByNombreInProvincia(nextProvincia, nextMunicipio);
        if (byName && byName.idMunicipio !== idMunicipio) {
            throw new app_error_1.ConflictError('Ya existe un municipio con ese nombre en esa provincia');
        }
        const updated = await this.municipios.update(idMunicipio, {
            idProvincia: nextProvincia,
            municipio: nextMunicipio,
            latitud: input.latitud,
            longitud: input.longitud,
            activo: input.activo,
            actualizadoPor: input.actualizadoPor,
        });
        return updated.toPrimitives();
    }
}
exports.UpdateMunicipioUseCase = UpdateMunicipioUseCase;
//# sourceMappingURL=update-municipio.use-case.js.map