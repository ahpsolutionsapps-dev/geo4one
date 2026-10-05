"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAnuncianteUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class CreateAnuncianteUseCase {
    anunciantes;
    constructor(anunciantes) {
        this.anunciantes = anunciantes;
    }
    async execute(input) {
        const sector = await this.anunciantes.findSectorById(input.idSectorIndustrial);
        if (!sector) {
            throw new app_error_1.NotFoundError('Sector industrial no encontrado');
        }
        if (!sector.activo) {
            throw new app_error_1.ValidationError('El sector industrial no esta activo');
        }
        const subSector = await this.anunciantes.findSubSectorById(input.idSubSectorIndustrial);
        if (!subSector) {
            throw new app_error_1.NotFoundError('Sub sector industrial no encontrado');
        }
        if (!subSector.activo) {
            throw new app_error_1.ValidationError('El sub sector industrial no esta activo');
        }
        if (subSector.idSectorIndustrial !== input.idSectorIndustrial) {
            throw new app_error_1.ValidationError('El sub sector no pertenece al sector industrial seleccionado');
        }
        const categoria = await this.anunciantes.findCategoriaById(input.idCategoriaAnunciante);
        if (!categoria) {
            throw new app_error_1.NotFoundError('Categoria de anunciante no encontrada');
        }
        if (!categoria.activo) {
            throw new app_error_1.ValidationError('La categoria de anunciante no esta activa');
        }
        if (categoria.idSectorIndustrial !== input.idSectorIndustrial) {
            throw new app_error_1.ValidationError('La categoria no pertenece al sector industrial seleccionado');
        }
        if (categoria.idSubSectorIndustrial !== input.idSubSectorIndustrial) {
            throw new app_error_1.ValidationError('La categoria no pertenece al sub sector seleccionado');
        }
        const existing = await this.anunciantes.findByNombreInCategoria(input.idCategoriaAnunciante, input.anunciante);
        if (existing) {
            throw new app_error_1.ValidationError('Ya existe un anunciante con ese nombre en la categoria seleccionada');
        }
        const created = await this.anunciantes.create({
            idSectorIndustrial: input.idSectorIndustrial,
            idSubSectorIndustrial: input.idSubSectorIndustrial,
            idCategoriaAnunciante: input.idCategoriaAnunciante,
            anunciante: input.anunciante,
            creadoPor: input.creadoPor,
        });
        return created.toPrimitives();
    }
}
exports.CreateAnuncianteUseCase = CreateAnuncianteUseCase;
//# sourceMappingURL=create-anunciante.use-case.js.map