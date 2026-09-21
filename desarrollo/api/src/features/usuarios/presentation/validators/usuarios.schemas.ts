import { z } from 'zod';
import {
  includeAnuladosQuerySchema,
  nullableDominicanPhone,
  nullableText,
  positiveIntIdParam,
} from '../../../../shared/presentation/schemas';

export const usuarioIdParamsSchema = z.object({
  id: positiveIntIdParam('Id de usuario inválido'),
});

export const getUsuariosQuerySchema = includeAnuladosQuerySchema;

const nullableRolId = z
  .union([z.coerce.number().int().positive(), z.null()])
  .optional();

const flagSchema = z
  .union([z.boolean(), z.coerce.number().int().min(0).max(1)])
  .optional()
  .transform((value) => {
    if (value === undefined) {
      return undefined;
    }

    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }

    return value;
  });

export const createUsuarioSchema = z.object({
  username: z.string().trim().min(3).max(80),
  email: z.string().trim().email().max(160),
  userpassword: z.string().min(6).max(120),
  nombre: z.string().trim().min(1).max(100).optional(),
  apellido: nullableText(100),
  telefono: nullableDominicanPhone(30),
  idRol: nullableRolId,
  palabraSecreta: nullableText(255),
  habilitado: flagSchema,
  verificado: flagSchema,
  estatus: z.coerce.number().int().min(0).max(1).optional(),
  idioma: z.string().trim().min(2).max(10).optional(),
  tema: z.enum(['claro', 'oscuro', 'sistema']).optional(),
  comentario: nullableText(500),
});

export const updateUsuarioSchema = z
  .object({
    username: z.string().trim().min(3).max(80).optional(),
    email: z.string().trim().email().max(160).optional(),
    userpassword: z.string().min(6).max(120).optional(),
    nombre: z.string().trim().min(1).max(100).optional(),
    apellido: nullableText(100),
    telefono: nullableDominicanPhone(30),
    idRol: nullableRolId,
    palabraSecreta: nullableText(255),
    habilitado: flagSchema,
    verificado: flagSchema,
    estatus: z.coerce.number().int().min(0).max(1).optional(),
    idioma: z.string().trim().min(2).max(10).optional(),
    tema: z.enum(['claro', 'oscuro', 'sistema']).optional(),
    comentario: nullableText(500),
  })
  .refine(
    (value) => Object.values(value).some((field) => field !== undefined),
    { message: 'Debes enviar al menos un campo para actualizar' },
  );

export type CreateUsuarioDTO = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioDTO = z.infer<typeof updateUsuarioSchema>;
