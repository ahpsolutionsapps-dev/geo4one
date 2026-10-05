"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCategoriaAnuncianteUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class UpdateCategoriaAnuncianteUseCase {
    categoriasAnunciantes;
    sectoresIndustriales;
    subSectoresIndustriales;
    constructor(categoriasAnunciantes, sectoresIndustriales, subSectoresIndustriales) {
        this.categoriasAnunciantes = categoriasAnunciantes;
        this.sectoresIndustriales = sectoresIndustriales;
        this.subSectoresIndustriales = subSectoresIndustriales;
    }
    async execute(idCategoriaAnunciante, input) {
        const existing = await this.categoriasAnunciantes.findById(idCategoriaAnunciante);
        if (!existing) {
            throw new app_error_1.NotFoundError('Categoría de anunciante no encontrada');
        }
        const existingData = existing.toPrimitives();
        const nextSectorIndustrial = input.idSectorIndustrial ?? existingData.idSectorIndustrial;
        const nextSubSectorIndustrial = input.idSubSectorIndustrial ?? existingData.idSubSectorIndustrial;
        const nextCategoriaAnunciante = input.categoriaAnunciante?.trim() ?? existingData.categoriaAnunciante;
        const sectorIndustrial = await this.sectoresIndustriales.findById(nextSectorIndustrial);
        if (!sectorIndustrial) {
            throw new app_error_1.NotFoundError('Sector industrial no encontrado');
        }
        const subSectorIndustrial = await this.subSectoresIndustriales.findById(nextSubSectorIndustrial);
        if (!subSectorIndustrial) {
            throw new app_error_1.NotFoundError('Sub sector industrial no encontrado');
        }
        if (subSectorIndustrial.toPrimitives().idSectorIndustrial !== nextSectorIndustrial) {
            throw new app_error_1.ValidationError('El sub sector industrial no pertenece al sector industrial seleccionado');
        }
        const existingByName = await this.categoriasAnunciantes.findByNombreInSubSector(nextSubSectorIndustrial, nextCategoriaAnunciante);
        if (existingByName && existingByName.toPrimitives().idCategoriaAnunciante !== idCategoriaAnunciante) {
            throw new app_error_1.ConflictError('Ya existe una categoría de anunciante con ese nombre en ese sub sector');
        }
        const updated = await this.categoriasAnunciantes.update(idCategoriaAnunciante, {
            idSectorIndustrial: input.idSectorIndustrial,
            idSubSectorIndustrial: input.idSubSectorIndustrial,
            categoriaAnunciante: input.categoriaAnunciante?.trim(),
            activo: input.activo,
            actualizadoPor: input.actualizadoPor,
        });
        return updated.toPrimitives();
    }
}
exports.UpdateCategoriaAnuncianteUseCase = UpdateCategoriaAnuncianteUseCase;
//# sourceMappingURL=update-categoria-anunciante.use-case.js.map