import { z } from 'zod';
import { nullableText, positiveIntIdParam } from '../../../../shared/presentation/schemas';

export const colocacionIdParamsSchema = z.object({
  id: positiveIntIdParam('Id de colocacion invalido'),
});

export const createColocacionSchema = z.object({
  codigoSeguimiento: z.string().trim().min(2).max(50),
  idElemento: z.coerce.number().int().positive(),
  idVersionCampana: z.coerce.number().int().positive(),
  idPeriodoColocacion: z.coerce.number().int().positive(),
  observaciones: nullableText(5000),
  activo: z.coerce.boolean().optional(),
});

export const updateColocacionSchema = z
  .object({
    codigoSeguimiento: z.string().trim().min(2).max(50).optional(),
    idElemento: z.coerce.number().int().positive().optional(),
    idVersionCampana: z.coerce.number().int().positive().optional(),
    idPeriodoColocacion: z.coerce.number().int().positive().optional(),
    observaciones: nullableText(5000),
    activo: z.coerce.boolean().optional(),
  })
  .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Debes enviar al menos un campo para actualizar',
  });

export type CreateColocacionDTO = z.infer<typeof createColocacionSchema>;
export type UpdateColocacionDTO = z.infer<typeof updateColocacionSchema>;
