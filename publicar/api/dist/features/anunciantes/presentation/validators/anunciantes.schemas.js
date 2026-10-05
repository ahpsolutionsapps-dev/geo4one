"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAnuncianteSchema = exports.createAnuncianteSchema = exports.categoriasOptionsQuerySchema = exports.subSectoresOptionsQuerySchema = exports.anuncianteIdParamsSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../../../shared/presentation/schemas");
exports.anuncianteIdParamsSchema = zod_1.z.object({
    id: (0, schemas_1.positiveIntIdParam)('Id de anunciante invalido'),
});
exports.subSectoresOptionsQuerySchema = zod_1.z.object({
    idSectorIndustrial: zod_1.z.coerce.number().int().positive().optional(),
});
exports.categoriasOptionsQuerySchema = zod_1.z.object({
    idSubSectorIndustrial: zod_1.z.coerce.number().int().positive().optional(),
});
exports.createAnuncianteSchema = zod_1.z.object({
    idSectorIndustrial: zod_1.z.coerce.number().int().positive(),
    idSubSectorIndustrial: zod_1.z.coerce.number().int().positive(),
    idCategoriaAnunciante: zod_1.z.coerce.number().int().positive(),
    anunciante: zod_1.z.string().trim().min(2).max(200),
    activo: zod_1.z.coerce.boolean().optional(),
});
exports.updateAnuncianteSchema = zod_1.z
    .object({
    idSectorIndustrial: zod_1.z.coerce.number().int().positive().optional(),
    idSubSectorIndustrial: zod_1.z.coerce.number().int().positive().optional(),
    idCategoriaAnunciante: zod_1.z.coerce.number().int().positive().optional(),
    anunciante: zod_1.z.string().trim().min(2).max(200).optional(),
    activo: zod_1.z.coerce.boolean().optional(),
})
    .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Debes enviar al menos un campo para actualizar',
});
//# sourceMappingURL=anunciantes.schemas.js.map