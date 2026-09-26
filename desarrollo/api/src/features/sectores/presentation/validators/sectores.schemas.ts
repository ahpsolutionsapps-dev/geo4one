import { z } from 'zod';
import { positiveIntIdParam } from '../../../../shared/presentation/schemas';

export const sectorIdParamsSchema = z.object({
  id: positiveIntIdParam('Id de sector inválido'),
});

const coordinateSchema = z
  .union([z.coerce.number(), z.null()])
  .optional()
  .transform((value) => (value === undefined ? undefined : value));

export const createSectorSchema = z.object({
  idMunicipio: z.coerce.number().int().positive(),
  sectorBarrio: z.string().trim().min(2).max(150),
  circunscripcion: z.string().trim().max(50).nullable().optional(),
  latitud: coordinateSchema,
  longitud: coordinateSchema,
});

export const updateSectorSchema = z
  .object({
    idMunicipio: z.coerce.number().int().positive().optional(),
    sectorBarrio: z.string().trim().min(2).max(150).optional(),
    circunscripcion: z.string().trim().max(50).nullable().optional(),
    latitud: coordinateSchema,
    longitud: coordinateSchema,
    activo: z.coerce.boolean().optional(),
  })
  .refine(
    (value) => Object.values(value).some((field) => field !== undefined),
    { message: 'Debes enviar al menos un campo para actualizar' },
  );

export type CreateSectorDTO = z.infer<typeof createSectorSchema>;
export type UpdateSectorDTO = z.infer<typeof updateSectorSchema>;
