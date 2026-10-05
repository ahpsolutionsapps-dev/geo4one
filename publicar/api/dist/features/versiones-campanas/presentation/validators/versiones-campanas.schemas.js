"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVersionCampanaSchema = exports.createVersionCampanaSchema = exports.marcasProductoOptionsQuerySchema = exports.versionCampanaIdParamsSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../../../shared/presentation/schemas");
const optionalNullablePositiveId = zod_1.z
    .union([zod_1.z.coerce.number().int().positive(), zod_1.z.null()])
    .optional();
exports.versionCampanaIdParamsSchema = zod_1.z.object({
    id: (0, schemas_1.positiveIntIdParam)('Id de version de campana invalido'),
});
exports.marcasProductoOptionsQuerySchema = zod_1.z.object({
    idAnunciante: zod_1.z.coerce.number().int().positive().optional(),
});
exports.createVersionCampanaSchema = zod_1.z
    .object({
    idAnunciante: zod_1.z.coerce.number().int().positive(),
    idMarcaProducto: optionalNullablePositiveId,
    idComboAnunciante: optionalNullablePositiveId,
    versionCampana: zod_1.z.string().trim().min(2).max(250),
    leyendaSeguimiento: (0, schemas_1.nullableText)(500),
    activo: zod_1.z.coerce.boolean().optional(),
})
    .superRefine((value, ctx) => {
    if (!value.idMarcaProducto && !value.idComboAnunciante) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'Debes seleccionar una marca/producto o un combo',
            path: ['idMarcaProducto'],
        });
    }
});
exports.updateVersionCampanaSchema = zod_1.z
    .object({
    idAnunciante: zod_1.z.coerce.number().int().positive().optional(),
    idMarcaProducto: optionalNullablePositiveId,
    idComboAnunciante: optionalNullablePositiveId,
    versionCampana: zod_1.z.string().trim().min(2).max(250).optional(),
    leyendaSeguimiento: (0, schemas_1.nullableText)(500),
    activo: zod_1.z.coerce.boolean().optional(),
})
    .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Debes enviar al menos un campo para actualizar',
});
//# sourceMappingURL=versiones-campanas.schemas.js.map