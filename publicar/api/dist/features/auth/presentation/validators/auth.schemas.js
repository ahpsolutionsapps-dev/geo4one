"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveQrLoginSessionSchema = exports.createQrLoginSessionSchema = exports.updatePreferencesSchema = exports.DARK_COLOR_SCHEMES = exports.THEME_MODES = exports.PRIMARY_COLORS = exports.confirmPasswordResetCodeSchema = exports.requestPasswordResetCodeSchema = exports.resetPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const emailSchema = zod_1.z
    .string()
    .trim()
    .min(1, 'El correo es obligatorio')
    .email('Correo inválido');
exports.registerSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, 'Usuario demasiado corto').max(50),
    email: emailSchema,
    password: zod_1.z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    idRol: zod_1.z.number().int().positive().optional(),
    palabraSecreta: zod_1.z.string().min(1).optional(),
    comentario: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: emailSchema,
    password: zod_1.z.string().min(1, 'La contraseña es obligatoria'),
});
exports.resetPasswordSchema = zod_1.z.object({
    email: emailSchema,
    palabraSecreta: zod_1.z
        .string()
        .trim()
        .min(1, 'La palabra secreta es obligatoria')
        .max(120),
    password: zod_1.z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});
exports.requestPasswordResetCodeSchema = zod_1.z.object({
    email: emailSchema,
});
exports.confirmPasswordResetCodeSchema = zod_1.z.object({
    email: emailSchema,
    code: zod_1.z
        .string()
        .trim()
        .regex(/^\d{6}$/, 'El código debe tener 6 dígitos'),
    password: zod_1.z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});
exports.PRIMARY_COLORS = [
    'brand',
    'indigo',
    'blue',
    'green',
    'amber',
    'purple',
    'rose',
];
exports.THEME_MODES = ['light', 'dark', 'system'];
exports.DARK_COLOR_SCHEMES = [
    'cinder',
    'navy',
    'mirage',
    'black',
    'mint',
];
exports.updatePreferencesSchema = zod_1.z
    .object({
    primaryColor: zod_1.z.enum(exports.PRIMARY_COLORS).optional(),
    themeMode: zod_1.z.enum(exports.THEME_MODES).optional(),
    darkColorScheme: zod_1.z.enum(exports.DARK_COLOR_SCHEMES).optional(),
})
    .refine((data) => data.primaryColor !== undefined ||
    data.themeMode !== undefined ||
    data.darkColorScheme !== undefined, { message: 'Debe enviar al menos una preferencia' });
exports.createQrLoginSessionSchema = zod_1.z.object({
    deviceName: zod_1.z.string().trim().min(1).max(120).optional(),
});
exports.approveQrLoginSessionSchema = zod_1.z.object({
    code: zod_1.z.string().trim().min(1, 'El código QR es obligatorio').max(200),
});
//# sourceMappingURL=auth.schemas.js.map