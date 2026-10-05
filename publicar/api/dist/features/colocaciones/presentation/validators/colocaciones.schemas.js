"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateColocacionSchema = exports.createColocacionSchema = exports.colocacionIdParamsSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../../../shared/presentation/schemas");
exports.colocacionIdParamsSchema = zod_1.z.object({
    id: (0, schemas_1.positiveIntIdParam)('Id de colocacion invalido'),
});
exports.createColocacionSchema = zod_1.z.object({
    codigoSeguimiento: zod_1.z.string().trim().min(2).max(50),
    idElemento: zod_1.z.coerce.number().int().positive(),
    idVersionCampana: zod_1.z.coerce.number().int().positive(),
    idPeriodoColocacion: zod_1.z.coerce.number().int().positive(),
    observaciones: (0, schemas_1.nullableText)(5000),
    activo: zod_1.z.coerce.boolean().optional(),
});
exports.updateColocacionSchema = zod_1.z
    .object({
    codigoSeguimiento: zod_1.z.string().trim().min(2).max(50).optional(),
    idElemento: zod_1.z.coerce.number().int().positive().optional(),
    idVersionCampana: zod_1.z.coerce.number().int().positive().optional(),
    idPeriodoColocacion: zod_1.z.coerce.number().int().positive().optional(),
    observaciones: (0, schemas_1.nullableText)(5000),
    activo: zod_1.z.coerce.boolean().optional(),
})
    .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Debes enviar al menos un campo para actualizar',
});
//# sourceMappingURL=colocaciones.schemas.js.map