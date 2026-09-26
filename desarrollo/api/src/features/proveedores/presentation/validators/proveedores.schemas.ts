import { z } from 'zod';
import { positiveIntIdParam } from '../../../../shared/presentation/schemas';

export const proveedorIdParamsSchema = z.object({
  id: positiveIntIdParam('Id de suplidor invalido'),
});

export const proveedorTelefonoParamsSchema = z.object({
  id: positiveIntIdParam('Id de suplidor invalido'),
  telefonoId: positiveIntIdParam('Id de telefono invalido'),
});

const optionalText = (max: number) =>
  z
    .union([z.string().trim().max(max), z.null()])
    .optional()
    .transform((value) => {
      if (value === undefined) {
        return undefined;
      }

      if (value === null) {
        return null;
      }

      return value.trim().length === 0 ? null : value.trim();
    });

const optionalIdSchema = z
  .union([z.coerce.number().int().positive(), z.null()])
  .optional()
  .transform((value) => (value === undefined ? undefined : value));

export const createProveedorSchema = z.object({
  proveedor: z.string().trim().min(2).max(200),
  rnc: optionalText(20),
  personaContacto: optionalText(150),
  cargo: optionalText(100),
  email: optionalText(150),
  paginaWeb: optionalText(255),
  direccion: optionalText(500),
  idProvincia: optionalIdSchema,
  idMunicipio: optionalIdSchema,
  idSectorBarrio: optionalIdSchema,
});

export const updateProveedorSchema = z
  .object({
    proveedor: z.string().trim().min(2).max(200).optional(),
    rnc: optionalText(20),
    personaContacto: optionalText(150),
    cargo: optionalText(100),
    email: optionalText(150),
    paginaWeb: optionalText(255),
    direccion: optionalText(500),
    idProvincia: optionalIdSchema,
    idMunicipio: optionalIdSchema,
    idSectorBarrio: optionalIdSchema,
    activo: z.coerce.boolean().optional(),
  })
  .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Debes enviar al menos un campo para actualizar',
  });

export const createProveedorTelefonoSchema = z
  .object({
    telefono: z.string().trim().min(5).max(50),
    tipo: optionalText(50),
    principal: z.coerce.boolean().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.principal === true && !value.tipo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['tipo'],
        message: 'El tipo es obligatorio cuando el teléfono es principal',
      });
    }
  });

export const updateProveedorTelefonoSchema = z
  .object({
    telefono: z.string().trim().min(5).max(50).optional(),
    tipo: optionalText(50),
    principal: z.coerce.boolean().optional(),
    activo: z.coerce.boolean().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.principal === true && !value.tipo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['tipo'],
        message: 'El tipo es obligatorio cuando el teléfono es principal',
      });
    }
  })
  .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Debes enviar al menos un campo para actualizar',
  });

export type CreateProveedorDTO = z.infer<typeof createProveedorSchema>;
export type UpdateProveedorDTO = z.infer<typeof updateProveedorSchema>;
export type CreateProveedorTelefonoDTO = z.infer<typeof createProveedorTelefonoSchema>;
export type UpdateProveedorTelefonoDTO = z.infer<typeof updateProveedorTelefonoSchema>;
