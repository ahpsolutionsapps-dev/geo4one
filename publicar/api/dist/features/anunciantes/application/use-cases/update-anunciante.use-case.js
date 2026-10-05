"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAnuncianteUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class UpdateAnuncianteUseCase {
    anunciantes;
    constructor(anunciantes) {
        this.anunciantes = anunciantes;
    }
    async execute(idAnunciante, input) {
        const existing = await this.anunciantes.findById(idAnunciante);
        if (!existing) {
            throw new app_error_1.NotFoundError('Anunciante no encontrado');
        }
        const current = existing.toPrimitives();
        const nextIdSector = input.idSectorIndustrial ?? current.idSectorIndustrial;
        const nextIdSubSector = input.idSubSectorIndustrial ?? current.idSubSectorIndustrial;
        const nextIdCategoria = input.idCategoriaAnunciante ?? current.idCategoriaAnunciante;
        const nextAnunciante = input.anunciante ?? current.anunciante;
        const sector = await this.anunciantes.findSectorById(nextIdSector);
        if (!sector) {
            throw new app_error_1.NotFoundError('Sector industrial no encontrado');
        }
        if (!sector.activo) {
            throw new app_error_1.ValidationError('El sector industrial no esta activo');
        }
        const subSector = await this.anunciantes.findSubSectorById(nextIdSubSector);
        if (!subSector) {
            throw new app_error_1.NotFoundError('Sub sector industrial no encontrado');
        }
        if (!subSector.activo) {
            throw new app_error_1.ValidationError('El sub sector industrial no esta activo');
        }
        if (subSector.idSectorIndustrial !== nextIdSector) {
            throw new app_error_1.ValidationError('El sub sector no pertenece al sector industrial seleccionado');
        }
        const categoria = await this.anunciantes.findCategoriaById(nextIdCategoria);
        if (!categoria) {
            throw new app_error_1.NotFoundError('Categoria de anunciante no encontrada');
        }
        if (!categoria.activo) {
            throw new app_error_1.ValidationError('La categoria de anunciante no esta activa');
        }
        if (categoria.idSectorIndustrial !== nextIdSector) {
            throw new app_error_1.ValidationError('La categoria no pertenece al sector industrial seleccionado');
        }
        if (categoria.idSubSectorIndustrial !== nextIdSubSector) {
            throw new app_error_1.ValidationError('La categoria no pertenece al sub sector seleccionado');
        }
        const duplicated = await this.anunciantes.findByNombreInCategoria(nextIdCategoria, nextAnunciante);
        if (duplicated && duplicated.toPrimitives().idAnunciante !== idAnunciante) {
            throw new app_error_1.ValidationError('Ya existe un anunciante con ese nombre en la categoria seleccionada');
        }
        const updated = await this.anunciantes.update(idAnunciante, {
            idSectorIndustrial: input.idSectorIndustrial,
            idSubSectorIndustrial: input.idSubSectorIndustrial,
            idCategoriaAnunciante: input.idCategoriaAnunciante,
            anunciante: input.anunciante,
            activo: input.activo,
            actualizadoPor: input.actualizadoPor,
        });
        return updated.toPrimitives();
    }
}
exports.UpdateAnuncianteUseCase = UpdateAnuncianteUseCase;
//# sourceMappingURL=update-anunciante.use-case.js.map