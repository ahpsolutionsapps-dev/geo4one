import { z } from 'zod';
import { includeAnuladosQuerySchema } from '../../../../shared/presentation/schemas';

export const getRolesQuerySchema = includeAnuladosQuerySchema;

export const rolIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const idModulosSchema = z
  .array(z.coerce.number().int().positive())
  .max(500)
  .optional()
  .default([]);

export const createRolSchema = z.object({
  rol: z.string().trim().min(2).max(80),
  descripcion: z.string().trim().min(2).max(500),
  idModulos: idModulosSchema,
});

export const updateRolSchema = z.object({
  rol: z.string().trim().min(2).max(80),
  descripcion: z.string().trim().min(2).max(500),
  idModulos: z.array(z.coerce.number().int().positive()).max(500).optional(),
  comentario: z.string().trim().max(500).nullable().optional(),
});

export const replaceRolModulosSchema = z.object({
  idModulos: z.array(z.coerce.number().int().positive()).max(500),
});

export type GetRolesQueryDTO = z.infer<typeof getRolesQuerySchema>;
