"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSectorSchema = exports.createSectorSchema = exports.sectorIdParamsSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../../../shared/presentation/schemas");
exports.sectorIdParamsSchema = zod_1.z.object({
    id: (0, schemas_1.positiveIntIdParam)('Id de sector inválido'),
});
const coordinateSchema = zod_1.z
    .union([zod_1.z.coerce.number(), zod_1.z.null()])
    .optional()
    .transform((value) => (value === undefined ? undefined : value));
exports.createSectorSchema = zod_1.z.object({
    idMunicipio: zod_1.z.coerce.number().int().positive(),
    sectorBarrio: zod_1.z.string().trim().min(2).max(150),
    circunscripcion: zod_1.z.string().trim().max(50).nullable().optional(),
    latitud: coordinateSchema,
    longitud: coordinateSchema,
});
exports.updateSectorSchema = zod_1.z
    .object({
    idMunicipio: zod_1.z.coerce.number().int().positive().optional(),
    sectorBarrio: zod_1.z.string().trim().min(2).max(150).optional(),
    circunscripcion: zod_1.z.string().trim().max(50).nullable().optional(),
    latitud: coordinateSchema,
    longitud: coordinateSchema,
    activo: zod_1.z.coerce.boolean().optional(),
})
    .refine((value) => Object.values(value).some((field) => field !== undefined), { message: 'Debes enviar al menos un campo para actualizar' });
//# sourceMappingURL=sectores.schemas.js.map