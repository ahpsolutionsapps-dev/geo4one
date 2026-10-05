"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMarcaProductoSchema = exports.createMarcaProductoSchema = exports.marcaProductoIdParamsSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../../../shared/presentation/schemas");
exports.marcaProductoIdParamsSchema = zod_1.z.object({
    id: (0, schemas_1.positiveIntIdParam)('Id de marca / producto inválido'),
});
exports.createMarcaProductoSchema = zod_1.z.object({
    idAnunciante: zod_1.z.coerce.number().int().positive(),
    idCategoriaAnunciante: zod_1.z.coerce.number().int().positive(),
    marcaProducto: zod_1.z.string().trim().min(2).max(200),
    activo: zod_1.z.coerce.boolean(),
});
exports.updateMarcaProductoSchema = zod_1.z
    .object({
    idAnunciante: zod_1.z.coerce.number().int().positive().optional(),
    idCategoriaAnunciante: zod_1.z.coerce.number().int().positive().optional(),
    marcaProducto: zod_1.z.string().trim().min(2).max(200).optional(),
    activo: zod_1.z.coerce.boolean().optional(),
})
    .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Debes enviar al menos un campo para actualizar',
});
//# sourceMappingURL=marcas-productos.schemas.js.map