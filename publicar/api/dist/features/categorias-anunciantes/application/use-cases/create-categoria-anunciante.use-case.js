"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCategoriaAnuncianteUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class CreateCategoriaAnuncianteUseCase {
    categoriasAnunciantes;
    sectoresIndustriales;
    subSectoresIndustriales;
    constructor(categoriasAnunciantes, sectoresIndustriales, subSectoresIndustriales) {
        this.categoriasAnunciantes = categoriasAnunciantes;
        this.sectoresIndustriales = sectoresIndustriales;
        this.subSectoresIndustriales = subSectoresIndustriales;
    }
    async execute(input) {
        const categoriaAnunciante = input.categoriaAnunciante.trim();
        const sectorIndustrial = await this.sectoresIndustriales.findById(input.idSectorIndustrial);
        if (!sectorIndustrial) {
            throw new app_error_1.NotFoundError('Sector industrial no encontrado');
        }
        const subSectorIndustrial = await this.subSectoresIndustriales.findById(input.idSubSectorIndustrial);
        if (!subSectorIndustrial) {
            throw new app_error_1.NotFoundError('Sub sector industrial no encontrado');
        }
        const subSectorData = subSectorIndustrial.toPrimitives();
        if (subSectorData.idSectorIndustrial !== input.idSectorIndustrial) {
            throw new app_error_1.ValidationError('El sub sector industrial no pertenece al sector industrial seleccionado');
        }
        const existing = await this.categoriasAnunciantes.findByNombreInSubSector(input.idSubSectorIndustrial, categoriaAnunciante);
        if (existing) {
            throw new app_error_1.ConflictError('Ya existe una categoría de anunciante con ese nombre en ese sub sector');
        }
        const created = await this.categoriasAnunciantes.create({
            idSectorIndustrial: input.idSectorIndustrial,
            idSubSectorIndustrial: input.idSubSectorIndustrial,
            categoriaAnunciante,
            creadoPor: input.creadoPor,
        });
        return created.toPrimitives();
    }
}
exports.CreateCategoriaAnuncianteUseCase = CreateCategoriaAnuncianteUseCase;
//# sourceMappingURL=create-categoria-anunciante.use-case.js.map