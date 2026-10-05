"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSectorUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class UpdateSectorUseCase {
    sectores;
    municipios;
    constructor(sectores, municipios) {
        this.sectores = sectores;
        this.municipios = municipios;
    }
    async execute(idSectorBarrio, input) {
        const existing = await this.sectores.findById(idSectorBarrio);
        if (!existing) {
            throw new app_error_1.NotFoundError('Sector no encontrado');
        }
        const existingData = existing.toPrimitives();
        const nextMunicipio = input.idMunicipio ?? existingData.idMunicipio;
        const nextSectorBarrio = input.sectorBarrio?.trim() ?? existingData.sectorBarrio;
        if (input.idMunicipio !== undefined) {
            const municipio = await this.municipios.findById(input.idMunicipio);
            if (!municipio) {
                throw new app_error_1.NotFoundError('Municipio no encontrado');
            }
        }
        const byName = await this.sectores.findByNombreInMunicipio(nextMunicipio, nextSectorBarrio);
        if (byName && byName.toPrimitives().idSectorBarrio !== idSectorBarrio) {
            throw new app_error_1.ConflictError('Ya existe un sector con ese nombre en ese municipio');
        }
        const updated = await this.sectores.update(idSectorBarrio, {
            idMunicipio: input.idMunicipio,
            sectorBarrio: input.sectorBarrio?.trim(),
            circunscripcion: input.circunscripcion,
            latitud: input.latitud,
            longitud: input.longitud,
            activo: input.activo,
            actualizadoPor: input.actualizadoPor,
        });
        return updated.toPrimitives();
    }
}
exports.UpdateSectorUseCase = UpdateSectorUseCase;
//# sourceMappingURL=update-sector.use-case.js.map