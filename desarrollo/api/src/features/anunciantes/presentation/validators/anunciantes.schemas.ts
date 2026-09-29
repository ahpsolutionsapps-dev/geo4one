import { z } from 'zod';
import { positiveIntIdParam } from '../../../../shared/presentation/schemas';

export const anuncianteIdParamsSchema = z.object({
  id: positiveIntIdParam('Id de anunciante invalido'),
});

export const subSectoresOptionsQuerySchema = z.object({
  idSectorIndustrial: z.coerce.number().int().positive().optional(),
});

export const categoriasOptionsQuerySchema = z.object({
  idSubSectorIndustrial: z.coerce.number().int().positive().optional(),
});

export const createAnuncianteSchema = z.object({
  idSectorIndustrial: z.coerce.number().int().positive(),
  idSubSectorIndustrial: z.coerce.number().int().positive(),
  idCategoriaAnunciante: z.coerce.number().int().positive(),
  anunciante: z.string().trim().min(2).max(200),
  activo: z.coerce.boolean().optional(),
});

export const updateAnuncianteSchema = z
  .object({
    idSectorIndustrial: z.coerce.number().int().positive().optional(),
    idSubSectorIndustrial: z.coerce.number().int().positive().optional(),
    idCategoriaAnunciante: z.coerce.number().int().positive().optional(),
    anunciante: z.string().trim().min(2).max(200).optional(),
    activo: z.coerce.boolean().optional(),
  })
  .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Debes enviar al menos un campo para actualizar',
  });

export type CreateAnuncianteDTO = z.infer<typeof createAnuncianteSchema>;
export type UpdateAnuncianteDTO = z.infer<typeof updateAnuncianteSchema>;
