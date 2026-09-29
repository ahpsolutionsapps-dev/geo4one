import { z } from 'zod';
import { nullableText, positiveIntIdParam } from '../../../../shared/presentation/schemas';

const optionalNullablePositiveId = z
  .union([z.coerce.number().int().positive(), z.null()])
  .optional();

export const versionCampanaIdParamsSchema = z.object({
  id: positiveIntIdParam('Id de version de campana invalido'),
});

export const marcasProductoOptionsQuerySchema = z.object({
  idAnunciante: z.coerce.number().int().positive().optional(),
});

export const createVersionCampanaSchema = z
  .object({
    idAnunciante: z.coerce.number().int().positive(),
    idMarcaProducto: optionalNullablePositiveId,
    idComboAnunciante: optionalNullablePositiveId,
    versionCampana: z.string().trim().min(2).max(250),
    leyendaSeguimiento: nullableText(500),
    activo: z.coerce.boolean().optional(),
  })
  .superRefine((value, ctx) => {
    if (!value.idMarcaProducto && !value.idComboAnunciante) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Debes seleccionar una marca/producto o un combo',
        path: ['idMarcaProducto'],
      });
    }
  });

export const updateVersionCampanaSchema = z
  .object({
    idAnunciante: z.coerce.number().int().positive().optional(),
    idMarcaProducto: optionalNullablePositiveId,
    idComboAnunciante: optionalNullablePositiveId,
    versionCampana: z.string().trim().min(2).max(250).optional(),
    leyendaSeguimiento: nullableText(500),
    activo: z.coerce.boolean().optional(),
  })
  .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Debes enviar al menos un campo para actualizar',
  });

export type CreateVersionCampanaDTO = z.infer<typeof createVersionCampanaSchema>;
export type UpdateVersionCampanaDTO = z.infer<typeof updateVersionCampanaSchema>;
