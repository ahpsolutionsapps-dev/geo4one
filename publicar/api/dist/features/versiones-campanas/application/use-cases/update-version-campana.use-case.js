"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVersionCampanaUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class UpdateVersionCampanaUseCase {
    versionesCampanas;
    constructor(versionesCampanas) {
        this.versionesCampanas = versionesCampanas;
    }
    async execute(idVersionCampana, input) {
        const existing = await this.versionesCampanas.findById(idVersionCampana);
        if (!existing) {
            throw new app_error_1.NotFoundError('Version de campana no encontrada');
        }
        const current = existing.toPrimitives();
        const nextIdAnunciante = input.idAnunciante ?? current.idAnunciante;
        const nextVersionCampana = input.versionCampana ?? current.versionCampana;
        const nextIdMarcaProducto = input.idMarcaProducto !== undefined ? input.idMarcaProducto : current.idMarcaProducto;
        const nextIdComboAnunciante = input.idComboAnunciante !== undefined ? input.idComboAnunciante : current.idComboAnunciante;
        const anunciante = await this.versionesCampanas.findAnuncianteById(nextIdAnunciante);
        if (!anunciante) {
            throw new app_error_1.NotFoundError('Anunciante no encontrado');
        }
        if (!anunciante.activo) {
            throw new app_error_1.ValidationError('El anunciante no esta activo');
        }
        if (!nextIdMarcaProducto && !nextIdComboAnunciante) {
            throw new app_error_1.ValidationError('Debes seleccionar una marca/producto o un combo');
        }
        if (nextIdMarcaProducto) {
            const marca = await this.versionesCampanas.findMarcaProductoById(nextIdMarcaProducto);
            if (!marca) {
                throw new app_error_1.NotFoundError('Marca/producto no encontrada');
            }
            if (!marca.activo) {
                throw new app_error_1.ValidationError('La marca/producto no esta activa');
            }
            if (marca.idAnunciante !== nextIdAnunciante) {
                throw new app_error_1.ValidationError('La marca/producto no pertenece al anunciante seleccionado');
            }
        }
        if (nextIdComboAnunciante) {
            const combo = await this.versionesCampanas.findComboAnuncianteById(nextIdComboAnunciante);
            if (!combo) {
                throw new app_error_1.NotFoundError('Combo de anunciante no encontrado');
            }
            if (!combo.activo) {
                throw new app_error_1.ValidationError('El combo de anunciante no esta activo');
            }
        }
        const duplicated = await this.versionesCampanas.findByNombreInAnunciante(nextIdAnunciante, nextVersionCampana);
        if (duplicated && duplicated.toPrimitives().idVersionCampana !== idVersionCampana) {
            throw new app_error_1.ValidationError('Ya existe una version de campana con ese nombre para el anunciante');
        }
        const updated = await this.versionesCampanas.update(idVersionCampana, {
            idAnunciante: input.idAnunciante,
            idMarcaProducto: input.idMarcaProducto,
            idComboAnunciante: input.idComboAnunciante,
            versionCampana: input.versionCampana,
            leyendaSeguimiento: input.leyendaSeguimiento,
            activo: input.activo,
            actualizadoPor: input.actualizadoPor,
        });
        return updated.toPrimitives();
    }
}
exports.UpdateVersionCampanaUseCase = UpdateVersionCampanaUseCase;
//# sourceMappingURL=update-version-campana.use-case.js.map