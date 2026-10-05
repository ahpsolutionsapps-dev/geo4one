"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSectorIndustrialSchema = exports.createSectorIndustrialSchema = exports.sectorIndustrialIdParamsSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../../../shared/presentation/schemas");
exports.sectorIndustrialIdParamsSchema = zod_1.z.object({
    id: (0, schemas_1.positiveIntIdParam)('Id de sector industrial inválido'),
});
exports.createSectorIndustrialSchema = zod_1.z.object({
    sectorIndustrial: zod_1.z.string().trim().min(2).max(150),
});
exports.updateSectorIndustrialSchema = zod_1.z
    .object({
    sectorIndustrial: zod_1.z.string().trim().min(2).max(150).optional(),
    activo: zod_1.z.coerce.boolean().optional(),
})
    .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Debes enviar al menos un campo para actualizar',
});
//# sourceMappingURL=sectores-industriales.schemas.js.map