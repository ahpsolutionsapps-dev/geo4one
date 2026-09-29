import { z } from 'zod';
import { positiveIntIdParam } from '../../../../shared/presentation/schemas';

export const categoriaAnuncianteIdParamsSchema = z.object({
  id: positiveIntIdParam('Id de categoría de anunciante inválido'),
});

export const createCategoriaAnuncianteSchema = z.object({
  idSectorIndustrial: z.coerce.number().int().positive(),
  idSubSectorIndustrial: z.coerce.number().int().positive(),
  categoriaAnunciante: z.string().trim().min(2).max(150),
});

export const updateCategoriaAnuncianteSchema = z
  .object({
    idSectorIndustrial: z.coerce.number().int().positive().optional(),
    idSubSectorIndustrial: z.coerce.number().int().positive().optional(),
    categoriaAnunciante: z.string().trim().min(2).max(150).optional(),
    activo: z.coerce.boolean().optional(),
  })
  .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Debes enviar al menos un campo para actualizar',
  });

export type CreateCategoriaAnuncianteDTO = z.infer<typeof createCategoriaAnuncianteSchema>;
export type UpdateCategoriaAnuncianteDTO = z.infer<typeof updateCategoriaAnuncianteSchema>;