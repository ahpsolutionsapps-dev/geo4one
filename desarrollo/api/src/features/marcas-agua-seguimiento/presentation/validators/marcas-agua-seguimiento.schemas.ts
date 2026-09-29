import { z } from 'zod';
import { positiveIntIdParam } from '../../../../shared/presentation/schemas';

const optionalMediaSchema = z
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
  .pipe(z.string().max(500).nullable().optional());

function atLeastOneMedia(
  value: { imagenMuestra?: string | null; videoMuestra?: string | null },
  ctx: z.RefinementCtx,
) {
  if (!value.imagenMuestra && !value.videoMuestra) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Debes enviar al menos una ruta de imagen o video',
      path: ['imagenMuestra'],
    });
  }
}

export const marcaAguaSeguimientoIdParamsSchema = z.object({
  id: positiveIntIdParam('Id de marca de agua invalido'),
});

export const createMarcaAguaSeguimientoSchema = z
  .object({
    idVersionCampana: z.coerce.number().int().positive(),
    imagenMuestra: optionalMediaSchema,
    videoMuestra: optionalMediaSchema,
    activo: z.coerce.boolean().optional(),
  })
  .superRefine(atLeastOneMedia);

export const updateMarcaAguaSeguimientoSchema = z
  .object({
    idVersionCampana: z.coerce.number().int().positive().optional(),
    imagenMuestra: optionalMediaSchema,
    videoMuestra: optionalMediaSchema,
    activo: z.coerce.boolean().optional(),
  })
  .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Debes enviar al menos un campo para actualizar',
  });

export type CreateMarcaAguaSeguimientoDTO = z.infer<typeof createMarcaAguaSeguimientoSchema>;
export type UpdateMarcaAguaSeguimientoDTO = z.infer<typeof updateMarcaAguaSeguimientoSchema>;
