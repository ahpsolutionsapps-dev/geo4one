"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubSectorIndustrialSchema = exports.createSubSectorIndustrialSchema = exports.subSectorIndustrialIdParamsSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../../../shared/presentation/schemas");
exports.subSectorIndustrialIdParamsSchema = zod_1.z.object({
    id: (0, schemas_1.positiveIntIdParam)('Id de sub sector industrial inválido'),
});
exports.createSubSectorIndustrialSchema = zod_1.z.object({
    idSectorIndustrial: zod_1.z.coerce.number().int().positive(),
    subSectorIndustrial: zod_1.z.string().trim().min(2).max(150),
});
exports.updateSubSectorIndustrialSchema = zod_1.z
    .object({
    idSectorIndustrial: zod_1.z.coerce.number().int().positive().optional(),
    subSectorIndustrial: zod_1.z.string().trim().min(2).max(150).optional(),
    activo: zod_1.z.coerce.boolean().optional(),
})
    .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Debes enviar al menos un campo para actualizar',
});
//# sourceMappingURL=sub-sectores-industriales.schemas.js.map