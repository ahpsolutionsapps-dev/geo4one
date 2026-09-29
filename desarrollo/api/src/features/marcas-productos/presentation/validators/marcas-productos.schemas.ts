import { z } from 'zod';
import { positiveIntIdParam } from '../../../../shared/presentation/schemas';

export const marcaProductoIdParamsSchema = z.object({
  id: positiveIntIdParam('Id de marca / producto inválido'),
});

export const createMarcaProductoSchema = z.object({
  idAnunciante: z.coerce.number().int().positive(),
  idCategoriaAnunciante: z.coerce.number().int().positive(),
  marcaProducto: z.string().trim().min(2).max(200),
  activo: z.coerce.boolean(),
});

export const updateMarcaProductoSchema = z
  .object({
    idAnunciante: z.coerce.number().int().positive().optional(),
    idCategoriaAnunciante: z.coerce.number().int().positive().optional(),
    marcaProducto: z.string().trim().min(2).max(200).optional(),
    activo: z.coerce.boolean().optional(),
  })
  .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Debes enviar al menos un campo para actualizar',
  });

export type CreateMarcaProductoDTO = z.infer<typeof createMarcaProductoSchema>;
export type UpdateMarcaProductoDTO = z.infer<typeof updateMarcaProductoSchema>;