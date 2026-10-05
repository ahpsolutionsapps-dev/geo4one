"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.positiveIntIdParam = exports.nullableDominicanPhone = exports.sortOrderQuerySchema = exports.paginationQuerySchema = exports.includeAnuladosQuerySchema = exports.nullableText = void 0;
const zod_1 = require("zod");
const nullableText = (max) => zod_1.z
    .union([zod_1.z.string(), zod_1.z.null()])
    .optional()
    .transform((value) => {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    const normalized = value.trim();
    return normalized.length === 0 ? null : normalized;
})
    .pipe(zod_1.z.string().max(max).nullable().optional());
exports.nullableText = nullableText;
exports.includeAnuladosQuerySchema = zod_1.z.object({
    includeAnulados: zod_1.z.coerce.boolean().optional().default(false),
});
exports.paginationQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().optional(),
    pageSize: zod_1.z.coerce.number().int().min(1).max(100).optional(),
});
exports.sortOrderQuerySchema = zod_1.z.enum(['asc', 'desc']);
const DOMINICAN_PHONE_REGEX = /^\((809|829|849)\) \d{3} \d{4}$/;
const nullableDominicanPhone = (max = 40) => zod_1.z
    .union([zod_1.z.string(), zod_1.z.null()])
    .optional()
    .transform((value) => {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    const normalized = value.trim();
    return normalized.length === 0 ? null : normalized;
})
    .pipe(zod_1.z
    .union([
    zod_1.z.null(),
    zod_1.z
        .string()
        .max(max)
        .regex(DOMINICAN_PHONE_REGEX, 'El telefono debe usar codigo de area 809, 829 o 849. Ej: (809) 000 0000'),
])
    .optional());
exports.nullableDominicanPhone = nullableDominicanPhone;
const positiveIntIdParam = (message) => zod_1.z.coerce.number().int().positive(message);
exports.positiveIntIdParam = positiveIntIdParam;
//# sourceMappingURL=schemas.js.map