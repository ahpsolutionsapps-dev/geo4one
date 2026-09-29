import { z } from 'zod';
import { positiveIntIdParam } from '../../../../shared/presentation/schemas';

const comboMarcaItemSchema = z.object({
  idMarcaProducto: z.coerce.number().int().positive(),
  orden: z.coerce.number().int().positive(),
});

function validateUnique(values: z.infer<typeof comboMarcaItemSchema>[], ctx: z.RefinementCtx) {
  const ids = new Set<number>();
  const ordenes = new Set<number>();

  values.forEach((item, index) => {
    if (ids.has(item.idMarcaProducto)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'No puedes repetir marcas de producto',
        path: [index, 'idMarcaProducto'],
      });
    }

    if (ordenes.has(item.orden)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'No puedes repetir ordenes de marca',
        path: [index, 'orden'],
      });
    }

    ids.add(item.idMarcaProducto);
    ordenes.add(item.orden);
  });
}

const comboMarcasSchema = z.array(comboMarcaItemSchema).min(1).superRefine(validateUnique);

export const comboAnuncianteIdParamsSchema = z.object({
  id: positiveIntIdParam('Id de combo de anunciante invalido'),
});

export const createComboAnuncianteSchema = z.object({
  comboAnunciante: z.string().trim().min(2).max(1000),
  marcas: comboMarcasSchema,
  activo: z.coerce.boolean().optional(),
});

export const updateComboAnuncianteSchema = z
  .object({
    comboAnunciante: z.string().trim().min(2).max(1000).optional(),
    marcas: comboMarcasSchema.optional(),
    activo: z.coerce.boolean().optional(),
  })
  .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Debes enviar al menos un campo para actualizar',
  });

export type CreateComboAnuncianteDTO = z.infer<typeof createComboAnuncianteSchema>;
export type UpdateComboAnuncianteDTO = z.infer<typeof updateComboAnuncianteSchema>;
