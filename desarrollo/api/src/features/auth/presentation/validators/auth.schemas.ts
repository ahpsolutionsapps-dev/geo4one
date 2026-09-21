import { z } from 'zod';

const emailSchema = z
  .string()
  .trim()
  .min(1, 'El correo es obligatorio')
  .email('Correo inválido');

export const registerSchema = z.object({
  username: z.string().min(3, 'Usuario demasiado corto').max(50),
  email: emailSchema,
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  idRol: z.number().int().positive().optional(),
  palabraSecreta: z.string().min(1).optional(),
  comentario: z.string().optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
  palabraSecreta: z
    .string()
    .trim()
    .min(1, 'La palabra secreta es obligatoria')
    .max(120),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const requestPasswordResetCodeSchema = z.object({
  email: emailSchema,
});

export const confirmPasswordResetCodeSchema = z.object({
  email: emailSchema,
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'El código debe tener 6 dígitos'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;
export type RequestPasswordResetCodeDTO = z.infer<
  typeof requestPasswordResetCodeSchema
>;
export type ConfirmPasswordResetCodeDTO = z.infer<
  typeof confirmPasswordResetCodeSchema
>;

export const PRIMARY_COLORS = [
  'brand',
  'indigo',
  'blue',
  'green',
  'amber',
  'purple',
  'rose',
] as const;

export const THEME_MODES = ['light', 'dark', 'system'] as const;

export const DARK_COLOR_SCHEMES = [
  'cinder',
  'navy',
  'mirage',
  'black',
  'mint',
] as const;

export const updatePreferencesSchema = z
  .object({
    primaryColor: z.enum(PRIMARY_COLORS).optional(),
    themeMode: z.enum(THEME_MODES).optional(),
    darkColorScheme: z.enum(DARK_COLOR_SCHEMES).optional(),
  })
  .refine(
    (data) =>
      data.primaryColor !== undefined ||
      data.themeMode !== undefined ||
      data.darkColorScheme !== undefined,
    { message: 'Debe enviar al menos una preferencia' },
  );

export type UpdatePreferencesDTO = z.infer<typeof updatePreferencesSchema>;

export const createQrLoginSessionSchema = z.object({
  deviceName: z.string().trim().min(1).max(120).optional(),
});

export const approveQrLoginSessionSchema = z.object({
  code: z.string().trim().min(1, 'El código QR es obligatorio').max(200),
});

export type CreateQrLoginSessionDTO = z.infer<typeof createQrLoginSessionSchema>;
export type ApproveQrLoginSessionDTO = z.infer<typeof approveQrLoginSessionSchema>;
