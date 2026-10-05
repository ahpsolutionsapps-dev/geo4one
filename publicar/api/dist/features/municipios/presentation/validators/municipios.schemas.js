"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMunicipioSchema = exports.createMunicipioSchema = exports.municipioIdParamsSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../../../shared/presentation/schemas");
exports.municipioIdParamsSchema = zod_1.z.object({
    id: (0, schemas_1.positiveIntIdParam)('Id de municipio inválido'),
});
const coordinateSchema = zod_1.z
    .union([zod_1.z.coerce.number(), zod_1.z.null()])
    .optional()
    .transform((value) => (value === undefined ? undefined : value));
exports.createMunicipioSchema = zod_1.z.object({
    idProvincia: zod_1.z.coerce.number().int().positive(),
    municipio: zod_1.z.string().trim().min(2).max(100),
    latitud: coordinateSchema,
    longitud: coordinateSchema,
});
exports.updateMunicipioSchema = zod_1.z
    .object({
    idProvincia: zod_1.z.coerce.number().int().positive().optional(),
    municipio: zod_1.z.string().trim().min(2).max(100).optional(),
    latitud: coordinateSchema,
    longitud: coordinateSchema,
    activo: zod_1.z.coerce.boolean().optional(),
})
    .refine((value) => Object.values(value).some((field) => field !== undefined), { message: 'Debes enviar al menos un campo para actualizar' });
//# sourceMappingURL=municipios.schemas.js.map