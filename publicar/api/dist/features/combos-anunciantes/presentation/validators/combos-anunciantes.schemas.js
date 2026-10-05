"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComboAnuncianteSchema = exports.createComboAnuncianteSchema = exports.comboAnuncianteIdParamsSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../../../shared/presentation/schemas");
const comboMarcaItemSchema = zod_1.z.object({
    idMarcaProducto: zod_1.z.coerce.number().int().positive(),
    orden: zod_1.z.coerce.number().int().positive(),
});
function validateUnique(values, ctx) {
    const ids = new Set();
    const ordenes = new Set();
    values.forEach((item, index) => {
        if (ids.has(item.idMarcaProducto)) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: 'No puedes repetir marcas de producto',
                path: [index, 'idMarcaProducto'],
            });
        }
        if (ordenes.has(item.orden)) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: 'No puedes repetir ordenes de marca',
                path: [index, 'orden'],
            });
        }
        ids.add(item.idMarcaProducto);
        ordenes.add(item.orden);
    });
}
const comboMarcasSchema = zod_1.z.array(comboMarcaItemSchema).min(1).superRefine(validateUnique);
exports.comboAnuncianteIdParamsSchema = zod_1.z.object({
    id: (0, schemas_1.positiveIntIdParam)('Id de combo de anunciante invalido'),
});
exports.createComboAnuncianteSchema = zod_1.z.object({
    comboAnunciante: zod_1.z.string().trim().min(2).max(1000),
    marcas: comboMarcasSchema,
    activo: zod_1.z.coerce.boolean().optional(),
});
exports.updateComboAnuncianteSchema = zod_1.z
    .object({
    comboAnunciante: zod_1.z.string().trim().min(2).max(1000).optional(),
    marcas: comboMarcasSchema.optional(),
    activo: zod_1.z.coerce.boolean().optional(),
})
    .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Debes enviar al menos un campo para actualizar',
});
//# sourceMappingURL=combos-anunciantes.schemas.js.map