import { z } from 'zod';

export const nullableText = (max: number) =>
  z
    .union([z.string(), z.null()])
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
    .pipe(z.string().max(max).nullable().optional());

export const includeAnuladosQuerySchema = z.object({
  includeAnulados: z.coerce.boolean().optional().default(false),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});

export const sortOrderQuerySchema = z.enum(['asc', 'desc']);

const DOMINICAN_PHONE_REGEX = /^\((809|829|849)\) \d{3} \d{4}$/;

export const nullableDominicanPhone = (max = 40) =>
  z
    .union([z.string(), z.null()])
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
    .pipe(
      z
        .union([
          z.null(),
          z
            .string()
            .max(max)
            .regex(
              DOMINICAN_PHONE_REGEX,
              'El telefono debe usar codigo de area 809, 829 o 849. Ej: (809) 000 0000',
            ),
        ])
        .optional(),
    );

export const positiveIntIdParam = (message: string) =>
  z.coerce.number().int().positive(message);
