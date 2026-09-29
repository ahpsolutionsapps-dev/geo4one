import { z } from 'zod';
import { positiveIntIdParam } from '../../../../shared/presentation/schemas';

export const subSectorIndustrialIdParamsSchema = z.object({
  id: positiveIntIdParam('Id de sub sector industrial inválido'),
});

export const createSubSectorIndustrialSchema = z.object({
  idSectorIndustrial: z.coerce.number().int().positive(),
  subSectorIndustrial: z.string().trim().min(2).max(150),
});

export const updateSubSectorIndustrialSchema = z
  .object({
    idSectorIndustrial: z.coerce.number().int().positive().optional(),
    subSectorIndustrial: z.string().trim().min(2).max(150).optional(),
    activo: z.coerce.boolean().optional(),
  })
  .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Debes enviar al menos un campo para actualizar',
  });

export type CreateSubSectorIndustrialDTO = z.infer<typeof createSubSectorIndustrialSchema>;
export type UpdateSubSectorIndustrialDTO = z.infer<typeof updateSubSectorIndustrialSchema>;