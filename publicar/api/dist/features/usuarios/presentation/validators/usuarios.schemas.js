"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUsuarioSchema = exports.createUsuarioSchema = exports.getUsuariosQuerySchema = exports.usuarioIdParamsSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../../../shared/presentation/schemas");
exports.usuarioIdParamsSchema = zod_1.z.object({
    id: (0, schemas_1.positiveIntIdParam)('Id de usuario inválido'),
});
exports.getUsuariosQuerySchema = schemas_1.includeAnuladosQuerySchema;
const nullableRolId = zod_1.z
    .union([zod_1.z.coerce.number().int().positive(), zod_1.z.null()])
    .optional();
const flagSchema = zod_1.z
    .union([zod_1.z.boolean(), zod_1.z.coerce.number().int().min(0).max(1)])
    .optional()
    .transform((value) => {
    if (value === undefined) {
        return undefined;
    }
    if (typeof value === 'boolean') {
        return value ? 1 : 0;
    }
    return value;
});
exports.createUsuarioSchema = zod_1.z.object({
    username: zod_1.z.string().trim().min(3).max(80),
    email: zod_1.z.string().trim().email().max(160),
    userpassword: zod_1.z.string().min(6).max(120),
    nombre: zod_1.z.string().trim().min(1).max(100).optional(),
    apellido: (0, schemas_1.nullableText)(100),
    telefono: (0, schemas_1.nullableDominicanPhone)(30),
    idRol: nullableRolId,
    palabraSecreta: (0, schemas_1.nullableText)(255),
    habilitado: flagSchema,
    verificado: flagSchema,
    estatus: zod_1.z.coerce.number().int().min(0).max(1).optional(),
    idioma: zod_1.z.string().trim().min(2).max(10).optional(),
    tema: zod_1.z.enum(['claro', 'oscuro', 'sistema']).optional(),
    comentario: (0, schemas_1.nullableText)(500),
});
exports.updateUsuarioSchema = zod_1.z
    .object({
    username: zod_1.z.string().trim().min(3).max(80).optional(),
    email: zod_1.z.string().trim().email().max(160).optional(),
    userpassword: zod_1.z.string().min(6).max(120).optional(),
    nombre: zod_1.z.string().trim().min(1).max(100).optional(),
    apellido: (0, schemas_1.nullableText)(100),
    telefono: (0, schemas_1.nullableDominicanPhone)(30),
    idRol: nullableRolId,
    palabraSecreta: (0, schemas_1.nullableText)(255),
    habilitado: flagSchema,
    verificado: flagSchema,
    estatus: zod_1.z.coerce.number().int().min(0).max(1).optional(),
    idioma: zod_1.z.string().trim().min(2).max(10).optional(),
    tema: zod_1.z.enum(['claro', 'oscuro', 'sistema']).optional(),
    comentario: (0, schemas_1.nullableText)(500),
})
    .refine((value) => Object.values(value).some((field) => field !== undefined), { message: 'Debes enviar al menos un campo para actualizar' });
//# sourceMappingURL=usuarios.schemas.js.map