"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateVersionCampanaUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class CreateVersionCampanaUseCase {
    versionesCampanas;
    constructor(versionesCampanas) {
        this.versionesCampanas = versionesCampanas;
    }
    async execute(input) {
        const anunciante = await this.versionesCampanas.findAnuncianteById(input.idAnunciante);
        if (!anunciante) {
            throw new app_error_1.NotFoundError('Anunciante no encontrado');
        }
        if (!anunciante.activo) {
            throw new app_error_1.ValidationError('El anunciante no esta activo');
        }
        if (!input.idMarcaProducto && !input.idComboAnunciante) {
            throw new app_error_1.ValidationError('Debes seleccionar una marca/producto o un combo');
        }
        if (input.idMarcaProducto) {
            const marca = await this.versionesCampanas.findMarcaProductoById(input.idMarcaProducto);
            if (!marca) {
                throw new app_error_1.NotFoundError('Marca/producto no encontrada');
            }
            if (!marca.activo) {
                throw new app_error_1.ValidationError('La marca/producto no esta activa');
            }
            if (marca.idAnunciante !== input.idAnunciante) {
                throw new app_error_1.ValidationError('La marca/producto no pertenece al anunciante seleccionado');
            }
        }
        if (input.idComboAnunciante) {
            const combo = await this.versionesCampanas.findComboAnuncianteById(input.idComboAnunciante);
            if (!combo) {
                throw new app_error_1.NotFoundError('Combo de anunciante no encontrado');
            }
            if (!combo.activo) {
                throw new app_error_1.ValidationError('El combo de anunciante no esta activo');
            }
        }
        const existing = await this.versionesCampanas.findByNombreInAnunciante(input.idAnunciante, input.versionCampana);
        if (existing) {
            throw new app_error_1.ValidationError('Ya existe una version de campana con ese nombre para el anunciante');
        }
        const created = await this.versionesCampanas.create({
            idAnunciante: input.idAnunciante,
            idMarcaProducto: input.idMarcaProducto,
            idComboAnunciante: input.idComboAnunciante,
            versionCampana: input.versionCampana,
            leyendaSeguimiento: input.leyendaSeguimiento,
            creadoPor: input.creadoPor,
        });
        return created.toPrimitives();
    }
}
exports.CreateVersionCampanaUseCase = CreateVersionCampanaUseCase;
//# sourceMappingURL=create-version-campana.use-case.js.map