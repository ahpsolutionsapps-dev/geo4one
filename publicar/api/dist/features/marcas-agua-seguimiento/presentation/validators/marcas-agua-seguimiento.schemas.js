"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMarcaAguaSeguimientoSchema = exports.createMarcaAguaSeguimientoSchema = exports.marcaAguaSeguimientoIdParamsSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../../../shared/presentation/schemas");
const optionalMediaSchema = zod_1.z
    .union([zod_1.z.string(), zod_1.z.null()])
    .optional()
    .transform((value) => {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    const normalized = value.trim();
    return normalized.length === 0 ? null : normalized;
})
    .pipe(zod_1.z.string().max(500).nullable().optional());
function atLeastOneMedia(value, ctx) {
    if (!value.imagenMuestra && !value.videoMuestra) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'Debes enviar al menos una ruta de imagen o video',
            path: ['imagenMuestra'],
        });
    }
}
exports.marcaAguaSeguimientoIdParamsSchema = zod_1.z.object({
    id: (0, schemas_1.positiveIntIdParam)('Id de marca de agua invalido'),
});
exports.createMarcaAguaSeguimientoSchema = zod_1.z
    .object({
    idVersionCampana: zod_1.z.coerce.number().int().positive(),
    imagenMuestra: optionalMediaSchema,
    videoMuestra: optionalMediaSchema,
    activo: zod_1.z.coerce.boolean().optional(),
})
    .superRefine(atLeastOneMedia);
exports.updateMarcaAguaSeguimientoSchema = zod_1.z
    .object({
    idVersionCampana: zod_1.z.coerce.number().int().positive().optional(),
    imagenMuestra: optionalMediaSchema,
    videoMuestra: optionalMediaSchema,
    activo: zod_1.z.coerce.boolean().optional(),
})
    .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Debes enviar al menos un campo para actualizar',
});
//# sourceMappingURL=marcas-agua-seguimiento.schemas.js.map