"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceRolModulosSchema = exports.updateRolSchema = exports.createRolSchema = exports.rolIdParamsSchema = exports.getRolesQuerySchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../../../shared/presentation/schemas");
exports.getRolesQuerySchema = schemas_1.includeAnuladosQuerySchema;
exports.rolIdParamsSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().int().positive(),
});
const idModulosSchema = zod_1.z
    .array(zod_1.z.coerce.number().int().positive())
    .max(500)
    .optional()
    .default([]);
exports.createRolSchema = zod_1.z.object({
    rol: zod_1.z.string().trim().min(2).max(80),
    descripcion: zod_1.z.string().trim().min(2).max(500),
    idModulos: idModulosSchema,
});
exports.updateRolSchema = zod_1.z.object({
    rol: zod_1.z.string().trim().min(2).max(80),
    descripcion: zod_1.z.string().trim().min(2).max(500),
    idModulos: zod_1.z.array(zod_1.z.coerce.number().int().positive()).max(500).optional(),
    comentario: zod_1.z.string().trim().max(500).nullable().optional(),
});
exports.replaceRolModulosSchema = zod_1.z.object({
    idModulos: zod_1.z.array(zod_1.z.coerce.number().int().positive()).max(500),
});
//# sourceMappingURL=roles.schemas.js.map