import { z } from 'zod';

export const listFilesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  fileName: z.string().optional(),
  mimeType: z.string().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
});

export const assignCategoriesSchema = z.object({
  categories: z.array(z.string().min(1)).min(1),
});

export const assignTagsSchema = z.object({
  tags: z.array(z.string().min(1)).min(1),
});

export const createApiKeySchema = z.object({
  name: z.string().min(1).max(100),
});

export const updateApiKeySchema = z.object({
  isActive: z.boolean(),
});

export const fileIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const apiKeyIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const generateReportPdfSchema = z.object({
  title: z.string().min(1).max(200),
  headers: z.array(z.string().min(1)).min(1),
  rows: z
    .array(
      z.array(z.union([z.string(), z.number(), z.boolean(), z.null()])),
    )
    .min(1),
  fileName: z.string().min(1).max(120).optional(),
});
