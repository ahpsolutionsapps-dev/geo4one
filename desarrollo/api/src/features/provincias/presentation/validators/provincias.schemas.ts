import { z } from 'zod';
import { positiveIntIdParam } from '../../../../shared/presentation/schemas';

export const provinciaIdParamsSchema = z.object({
  id: positiveIntIdParam('Id de provincia inválido'),
});

const coordinateSchema = z
  .union([z.coerce.number(), z.null()])
  .optional()
  .transform((value) => (value === undefined ? undefined : value));

export const createProvinciaSchema = z.object({
  provincia: z.string().trim().min(2).max(100),
  latitud: coordinateSchema,
  longitud: coordinateSchema,
});

export const updateProvinciaSchema = z
  .object({
    provincia: z.string().trim().min(2).max(100).optional(),
    latitud: coordinateSchema,
    longitud: coordinateSchema,
    activo: z.coerce.boolean().optional(),
  })
  .refine(
    (value) => Object.values(value).some((field) => field !== undefined),
    { message: 'Debes enviar al menos un campo para actualizar' },
  );

export type CreateProvinciaDTO = z.infer<typeof createProvinciaSchema>;
export type UpdateProvinciaDTO = z.infer<typeof updateProvinciaSchema>;
