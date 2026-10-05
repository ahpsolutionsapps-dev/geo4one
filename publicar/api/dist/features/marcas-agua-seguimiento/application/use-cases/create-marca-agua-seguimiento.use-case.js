"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMarcaAguaSeguimientoUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
function normalizeOptionalMedia(value) {
    if (value === undefined || value === null) {
        return null;
    }
    const normalized = value.trim();
    return normalized.length === 0 ? null : normalized;
}
class CreateMarcaAguaSeguimientoUseCase {
    marcasAguaSeguimiento;
    constructor(marcasAguaSeguimiento) {
        this.marcasAguaSeguimiento = marcasAguaSeguimiento;
    }
    async execute(input) {
        const version = await this.marcasAguaSeguimiento.findVersionCampanaById(input.idVersionCampana);
        if (!version) {
            throw new app_error_1.NotFoundError('Version de campana no encontrada');
        }
        if (!version.activo || version.anulado) {
            throw new app_error_1.ValidationError('La version de campana no esta disponible para seguimiento');
        }
        const imagenMuestra = normalizeOptionalMedia(input.imagenMuestra);
        const videoMuestra = normalizeOptionalMedia(input.videoMuestra);
        if (!imagenMuestra && !videoMuestra) {
            throw new app_error_1.ValidationError('Debes enviar al menos una ruta de imagen o video');
        }
        const created = await this.marcasAguaSeguimiento.create({
            idVersionCampana: input.idVersionCampana,
            imagenMuestra,
            videoMuestra,
            creadoPor: input.creadoPor,
        });
        return created.toPrimitives();
    }
}
exports.CreateMarcaAguaSeguimientoUseCase = CreateMarcaAguaSeguimientoUseCase;
//# sourceMappingURL=create-marca-agua-seguimiento.use-case.js.map