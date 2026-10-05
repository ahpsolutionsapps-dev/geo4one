"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePeriodoColocacionSchema = exports.createPeriodoColocacionSchema = exports.periodoColocacionIdParamsSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../../../shared/presentation/schemas");
const dateField = zod_1.z.coerce.date();
const optionalNotesField = zod_1.z
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
    .pipe(zod_1.z.string().max(2000).nullable().optional());
exports.periodoColocacionIdParamsSchema = zod_1.z.object({
    id: (0, schemas_1.positiveIntIdParam)('Id de periodo de colocacion invalido'),
});
exports.createPeriodoColocacionSchema = zod_1.z.object({
    fechaInicial: dateField,
    fechaFinal: dateField,
    generalesSeguimiento: optionalNotesField,
    activo: zod_1.z.coerce.boolean().optional(),
});
exports.updatePeriodoColocacionSchema = zod_1.z
    .object({
    fechaInicial: dateField.optional(),
    fechaFinal: dateField.optional(),
    generalesSeguimiento: optionalNotesField,
    activo: zod_1.z.coerce.boolean().optional(),
})
    .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Debes enviar al menos un campo para actualizar',
});
//# sourceMappingURL=periodos-colocacion.schemas.js.map