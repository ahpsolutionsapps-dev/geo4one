"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReportPdfSchema = exports.apiKeyIdParamSchema = exports.fileIdParamSchema = exports.updateApiKeySchema = exports.createApiKeySchema = exports.assignTagsSchema = exports.assignCategoriesSchema = exports.listFilesQuerySchema = void 0;
const zod_1 = require("zod");
exports.listFilesQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().optional(),
    limit: zod_1.z.coerce.number().int().positive().max(100).optional(),
    fileName: zod_1.z.string().optional(),
    mimeType: zod_1.z.string().optional(),
    dateFrom: zod_1.z.coerce.date().optional(),
    dateTo: zod_1.z.coerce.date().optional(),
    category: zod_1.z.string().optional(),
    tag: zod_1.z.string().optional(),
});
exports.assignCategoriesSchema = zod_1.z.object({
    categories: zod_1.z.array(zod_1.z.string().min(1)).min(1),
});
exports.assignTagsSchema = zod_1.z.object({
    tags: zod_1.z.array(zod_1.z.string().min(1)).min(1),
});
exports.createApiKeySchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
});
exports.updateApiKeySchema = zod_1.z.object({
    isActive: zod_1.z.boolean(),
});
exports.fileIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.apiKeyIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.generateReportPdfSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200),
    headers: zod_1.z.array(zod_1.z.string().min(1)).min(1),
    rows: zod_1.z
        .array(zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number(), zod_1.z.boolean(), zod_1.z.null()])))
        .min(1),
    fileName: zod_1.z.string().min(1).max(120).optional(),
});
//# sourceMappingURL=index.js.map