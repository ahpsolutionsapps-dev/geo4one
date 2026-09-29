import { z } from 'zod';
import { positiveIntIdParam } from '../../../../shared/presentation/schemas';

const dateField = z.coerce.date();

const optionalNotesField = z
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
  .pipe(z.string().max(2000).nullable().optional());

export const periodoColocacionIdParamsSchema = z.object({
  id: positiveIntIdParam('Id de periodo de colocacion invalido'),
});

export const createPeriodoColocacionSchema = z.object({
  fechaInicial: dateField,
  fechaFinal: dateField,
  generalesSeguimiento: optionalNotesField,
  activo: z.coerce.boolean().optional(),
});

export const updatePeriodoColocacionSchema = z
  .object({
    fechaInicial: dateField.optional(),
    fechaFinal: dateField.optional(),
    generalesSeguimiento: optionalNotesField,
    activo: z.coerce.boolean().optional(),
  })
  .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Debes enviar al menos un campo para actualizar',
  });

export type CreatePeriodoColocacionDTO = z.infer<typeof createPeriodoColocacionSchema>;
export type UpdatePeriodoColocacionDTO = z.infer<typeof updatePeriodoColocacionSchema>;
