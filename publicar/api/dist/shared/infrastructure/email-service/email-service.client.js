"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpEmailServiceClient = void 0;
const app_error_1 = require("../../../core/errors/app-error");
class HttpEmailServiceClient {
    options;
    apiKeyHeader;
    constructor(options) {
        this.options = options;
        this.apiKeyHeader = options.apiKeyHeader ?? 'X-API-KEY';
    }
    async sendPasswordResetCode(input) {
        return this.postJson('/api/emails/password-reset-code', {
            to: input.to,
            code: input.code,
            appName: input.appName,
            expiresInMinutes: input.expiresInMinutes,
        }, 'Error al enviar el correo de recuperación');
    }
    async sendInvitation(input) {
        return this.postJson('/api/emails/send', {
            to: input.to,
            template: 'invitation',
            subject: `Activa tu cuenta de ${input.businessName}`,
            props: {
                businessName: input.businessName,
                contactName: input.contactName,
                activationUrl: input.activationUrl,
                planName: input.planName,
                expiresInDays: input.expiresInDays,
            },
        }, 'Error al enviar la invitación');
    }
    async postJson(path, body, errorMessage) {
        const baseUrl = this.options.baseUrl.replace(/\/$/, '');
        let response;
        try {
            response = await fetch(`${baseUrl}${path}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    [this.apiKeyHeader]: this.options.apiKey,
                },
                body: JSON.stringify(body),
            });
        }
        catch {
            throw new app_error_1.AppError('No se pudo conectar con el servicio de correo', 502, 'EMAIL_SERVICE_UNAVAILABLE');
        }
        const payload = (await response.json().catch(() => null));
        if (!response.ok) {
            throw new app_error_1.AppError(payload?.message ?? errorMessage, response.status >= 400 ? response.status : 502, 'EMAIL_SERVICE_ERROR');
        }
        return {
            message: payload?.message ?? 'Correo enviado',
            messageId: payload?.messageId,
            previewUrl: payload?.previewUrl,
        };
    }
}
exports.HttpEmailServiceClient = HttpEmailServiceClient;
//# sourceMappingURL=email-service.client.js.map