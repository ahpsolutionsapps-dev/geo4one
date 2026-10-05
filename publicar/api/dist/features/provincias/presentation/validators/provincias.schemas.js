"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProvinciaSchema = exports.createProvinciaSchema = exports.provinciaIdParamsSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../../../shared/presentation/schemas");
exports.provinciaIdParamsSchema = zod_1.z.object({
    id: (0, schemas_1.positiveIntIdParam)('Id de provincia inválido'),
});
const coordinateSchema = zod_1.z
    .union([zod_1.z.coerce.number(), zod_1.z.null()])
    .optional()
    .transform((value) => (value === undefined ? undefined : value));
exports.createProvinciaSchema = zod_1.z.object({
    provincia: zod_1.z.string().trim().min(2).max(100),
    latitud: coordinateSchema,
    longitud: coordinateSchema,
});
exports.updateProvinciaSchema = zod_1.z
    .object({
    provincia: zod_1.z.string().trim().min(2).max(100).optional(),
    latitud: coordinateSchema,
    longitud: coordinateSchema,
    activo: zod_1.z.coerce.boolean().optional(),
})
    .refine((value) => Object.values(value).some((field) => field !== undefined), { message: 'Debes enviar al menos un campo para actualizar' });
//# sourceMappingURL=provincias.schemas.js.map