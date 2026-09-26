import { z } from 'zod';
import { positiveIntIdParam } from '../../../../shared/presentation/schemas';

export const municipioIdParamsSchema = z.object({
  id: positiveIntIdParam('Id de municipio inválido'),
});

const coordinateSchema = z
  .union([z.coerce.number(), z.null()])
  .optional()
  .transform((value) => (value === undefined ? undefined : value));

export const createMunicipioSchema = z.object({
  idProvincia: z.coerce.number().int().positive(),
  municipio: z.string().trim().min(2).max(100),
  latitud: coordinateSchema,
  longitud: coordinateSchema,
});

export const updateMunicipioSchema = z
  .object({
    idProvincia: z.coerce.number().int().positive().optional(),
    municipio: z.string().trim().min(2).max(100).optional(),
    latitud: coordinateSchema,
    longitud: coordinateSchema,
    activo: z.coerce.boolean().optional(),
  })
  .refine(
    (value) => Object.values(value).some((field) => field !== undefined),
    { message: 'Debes enviar al menos un campo para actualizar' },
  );

export type CreateMunicipioDTO = z.infer<typeof createMunicipioSchema>;
export type UpdateMunicipioDTO = z.infer<typeof updateMunicipioSchema>;
