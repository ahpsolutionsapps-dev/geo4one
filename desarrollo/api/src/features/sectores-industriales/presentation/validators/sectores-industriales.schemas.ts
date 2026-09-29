import { z } from 'zod';
import { positiveIntIdParam } from '../../../../shared/presentation/schemas';

export const sectorIndustrialIdParamsSchema = z.object({
  id: positiveIntIdParam('Id de sector industrial inválido'),
});

export const createSectorIndustrialSchema = z.object({
  sectorIndustrial: z.string().trim().min(2).max(150),
});

export const updateSectorIndustrialSchema = z
  .object({
    sectorIndustrial: z.string().trim().min(2).max(150).optional(),
    activo: z.coerce.boolean().optional(),
  })
  .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Debes enviar al menos un campo para actualizar',
  });

export type CreateSectorIndustrialDTO = z.infer<typeof createSectorIndustrialSchema>;
export type UpdateSectorIndustrialDTO = z.infer<typeof updateSectorIndustrialSchema>;