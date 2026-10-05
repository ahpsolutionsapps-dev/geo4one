"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarcaAguaSeguimientoUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
function normalizeOptionalMedia(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    const normalized = value.trim();
    return normalized.length === 0 ? null : normalized;
}
class UpdateMarcaAguaSeguimientoUseCase {
    marcasAguaSeguimiento;
    constructor(marcasAguaSeguimiento) {
        this.marcasAguaSeguimiento = marcasAguaSeguimiento;
    }
    async execute(idFirmaMarcaAguaSeguimiento, input) {
        const existing = await this.marcasAguaSeguimiento.findById(idFirmaMarcaAguaSeguimiento);
        if (!existing) {
            throw new app_error_1.NotFoundError('Marca de agua no encontrada');
        }
        const existingData = existing.toPrimitives();
        const nextVersion = input.idVersionCampana ?? existingData.idVersionCampana;
        const nextImagen = normalizeOptionalMedia(input.imagenMuestra);
        const nextVideo = normalizeOptionalMedia(input.videoMuestra);
        const version = await this.marcasAguaSeguimiento.findVersionCampanaById(nextVersion);
        if (!version) {
            throw new app_error_1.NotFoundError('Version de campana no encontrada');
        }
        if (!version.activo || version.anulado) {
            throw new app_error_1.ValidationError('La version de campana no esta disponible para seguimiento');
        }
        const finalImagen = nextImagen === undefined ? existingData.imagenMuestra : nextImagen;
        const finalVideo = nextVideo === undefined ? existingData.videoMuestra : nextVideo;
        if (!finalImagen && !finalVideo) {
            throw new app_error_1.ValidationError('Debes enviar al menos una ruta de imagen o video');
        }
        const updated = await this.marcasAguaSeguimiento.update(idFirmaMarcaAguaSeguimiento, {
            idVersionCampana: input.idVersionCampana,
            imagenMuestra: nextImagen,
            videoMuestra: nextVideo,
            activo: input.activo,
            actualizadoPor: input.actualizadoPor,
        });
        return updated.toPrimitives();
    }
}
exports.UpdateMarcaAguaSeguimientoUseCase = UpdateMarcaAguaSeguimientoUseCase;
//# sourceMappingURL=update-marca-agua-seguimiento.use-case.js.map