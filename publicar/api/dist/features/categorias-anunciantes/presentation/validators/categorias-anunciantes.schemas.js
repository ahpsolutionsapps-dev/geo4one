"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategoriaAnuncianteSchema = exports.createCategoriaAnuncianteSchema = exports.categoriaAnuncianteIdParamsSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../../../shared/presentation/schemas");
exports.categoriaAnuncianteIdParamsSchema = zod_1.z.object({
    id: (0, schemas_1.positiveIntIdParam)('Id de categoría de anunciante inválido'),
});
exports.createCategoriaAnuncianteSchema = zod_1.z.object({
    idSectorIndustrial: zod_1.z.coerce.number().int().positive(),
    idSubSectorIndustrial: zod_1.z.coerce.number().int().positive(),
    categoriaAnunciante: zod_1.z.string().trim().min(2).max(150),
});
exports.updateCategoriaAnuncianteSchema = zod_1.z
    .object({
    idSectorIndustrial: zod_1.z.coerce.number().int().positive().optional(),
    idSubSectorIndustrial: zod_1.z.coerce.number().int().positive().optional(),
    categoriaAnunciante: zod_1.z.string().trim().min(2).max(150).optional(),
    activo: zod_1.z.coerce.boolean().optional(),
})
    .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Debes enviar al menos un campo para actualizar',
});
//# sourceMappingURL=categorias-anunciantes.schemas.js.map