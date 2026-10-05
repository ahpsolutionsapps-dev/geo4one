"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProveedorTelefonoSchema = exports.createProveedorTelefonoSchema = exports.updateProveedorSchema = exports.createProveedorSchema = exports.proveedorTelefonoParamsSchema = exports.proveedorIdParamsSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../../../shared/presentation/schemas");
exports.proveedorIdParamsSchema = zod_1.z.object({
    id: (0, schemas_1.positiveIntIdParam)('Id de suplidor invalido'),
});
exports.proveedorTelefonoParamsSchema = zod_1.z.object({
    id: (0, schemas_1.positiveIntIdParam)('Id de suplidor invalido'),
    telefonoId: (0, schemas_1.positiveIntIdParam)('Id de telefono invalido'),
});
const optionalText = (max) => zod_1.z
    .union([zod_1.z.string().trim().max(max), zod_1.z.null()])
    .optional()
    .transform((value) => {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return value.trim().length === 0 ? null : value.trim();
});
const optionalIdSchema = zod_1.z
    .union([zod_1.z.coerce.number().int().positive(), zod_1.z.null()])
    .optional()
    .transform((value) => (value === undefined ? undefined : value));
exports.createProveedorSchema = zod_1.z.object({
    proveedor: zod_1.z.string().trim().min(2).max(200),
    rnc: optionalText(20),
    personaContacto: optionalText(150),
    cargo: optionalText(100),
    email: optionalText(150),
    paginaWeb: optionalText(255),
    direccion: optionalText(500),
    idProvincia: optionalIdSchema,
    idMunicipio: optionalIdSchema,
    idSectorBarrio: optionalIdSchema,
});
exports.updateProveedorSchema = zod_1.z
    .object({
    proveedor: zod_1.z.string().trim().min(2).max(200).optional(),
    rnc: optionalText(20),
    personaContacto: optionalText(150),
    cargo: optionalText(100),
    email: optionalText(150),
    paginaWeb: optionalText(255),
    direccion: optionalText(500),
    idProvincia: optionalIdSchema,
    idMunicipio: optionalIdSchema,
    idSectorBarrio: optionalIdSchema,
    activo: zod_1.z.coerce.boolean().optional(),
})
    .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Debes enviar al menos un campo para actualizar',
});
exports.createProveedorTelefonoSchema = zod_1.z
    .object({
    telefono: zod_1.z.string().trim().min(5).max(50),
    tipo: optionalText(50),
    principal: zod_1.z.coerce.boolean().optional(),
})
    .superRefine((value, ctx) => {
    if (value.principal === true && !value.tipo) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ['tipo'],
            message: 'El tipo es obligatorio cuando el teléfono es principal',
        });
    }
});
exports.updateProveedorTelefonoSchema = zod_1.z
    .object({
    telefono: zod_1.z.string().trim().min(5).max(50).optional(),
    tipo: optionalText(50),
    principal: zod_1.z.coerce.boolean().optional(),
    activo: zod_1.z.coerce.boolean().optional(),
})
    .superRefine((value, ctx) => {
    if (value.principal === true && !value.tipo) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ['tipo'],
            message: 'El tipo es obligatorio cuando el teléfono es principal',
        });
    }
})
    .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Debes enviar al menos un campo para actualizar',
});
//# sourceMappingURL=proveedores.schemas.js.map