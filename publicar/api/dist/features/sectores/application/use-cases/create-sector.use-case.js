"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSectorUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class CreateSectorUseCase {
    sectores;
    municipios;
    constructor(sectores, municipios) {
        this.sectores = sectores;
        this.municipios = municipios;
    }
    async execute(input) {
        const sectorBarrio = input.sectorBarrio.trim();
        const municipio = await this.municipios.findById(input.idMunicipio);
        if (!municipio) {
            throw new app_error_1.NotFoundError('Municipio no encontrado');
        }
        const existing = await this.sectores.findByNombreInMunicipio(input.idMunicipio, sectorBarrio);
        if (existing) {
            throw new app_error_1.ConflictError('Ya existe un sector con ese nombre en ese municipio');
        }
        const created = await this.sectores.create({
            idMunicipio: input.idMunicipio,
            sectorBarrio,
            circunscripcion: input.circunscripcion ?? null,
            latitud: input.latitud ?? null,
            longitud: input.longitud ?? null,
            creadoPor: input.creadoPor,
        });
        return created.toPrimitives();
    }
}
exports.CreateSectorUseCase = CreateSectorUseCase;
//# sourceMappingURL=create-sector.use-case.js.map