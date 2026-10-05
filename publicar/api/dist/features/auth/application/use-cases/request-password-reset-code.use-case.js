"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestPasswordResetCodeUseCase = void 0;
const env_1 = require("../../../../core/config/env");
class RequestPasswordResetCodeUseCase {
    users;
    codes;
    emailService;
    constructor(users, codes, emailService) {
        this.users = users;
        this.codes = codes;
        this.emailService = emailService;
    }
    async execute(email) {
        const normalizedEmail = email.trim();
        const user = await this.users.findByEmail(normalizedEmail);
        // Respuesta genérica para no revelar si el correo existe.
        const baseResponse = {
            message: 'Si el correo está registrado, te enviamos un código de verificación.',
            expiresInSeconds: 600,
        };
        if (!user || !user.canLogin()) {
            return baseResponse;
        }
        const { code } = this.codes.create(normalizedEmail);
        try {
            const sent = await this.emailService.sendPasswordResetCode({
                to: normalizedEmail,
                code,
                appName: 'App Gestion Negocios',
                expiresInMinutes: 10,
            });
            if (env_1.env.isDevelopment) {
                console.info(`[reset-password] Código enviado a ${normalizedEmail}` +
                    (sent.previewUrl ? ` | preview: ${sent.previewUrl}` : ''));
            }
            return {
                ...baseResponse,
                previewUrl: env_1.env.isDevelopment ? sent.previewUrl : undefined,
            };
        }
        catch (error) {
            // Evita dejar un código huérfano si el correo no se pudo enviar.
            this.codes.invalidate(normalizedEmail);
            if (env_1.env.isDevelopment) {
                console.error('[reset-password] Error al enviar código', error);
            }
            throw error;
        }
    }
}
exports.RequestPasswordResetCodeUseCase = RequestPasswordResetCodeUseCase;
//# sourceMappingURL=request-password-reset-code.use-case.js.map