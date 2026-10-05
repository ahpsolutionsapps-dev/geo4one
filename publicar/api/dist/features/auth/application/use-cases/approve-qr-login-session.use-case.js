"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApproveQrLoginSessionUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
const prisma_1 = require("../../../../core/database/prisma");
const create_qr_login_session_use_case_1 = require("./create-qr-login-session.use-case");
class ApproveQrLoginSessionUseCase {
    users;
    tokens;
    constructor(users, tokens) {
        this.users = users;
        this.tokens = tokens;
    }
    async execute(idUsuario, rawCode) {
        const code = this.normalizeCode(rawCode);
        if (!code) {
            throw new app_error_1.NotFoundError('Código QR inválido');
        }
        const user = await this.users.findById(idUsuario);
        if (!user || !user.canLogin()) {
            throw new app_error_1.UnauthorizedError('Usuario no autorizado');
        }
        if (!user.canAccessModules()) {
            throw new app_error_1.ForbiddenError('La cuenta debe estar verificada para vincular dispositivos');
        }
        const session = await prisma_1.prisma.qrLoginSession.findFirst({
            where: { code },
        });
        if (!session) {
            throw new app_error_1.NotFoundError('Sesión QR no encontrada');
        }
        if (session.status === 'consumed') {
            throw new app_error_1.ConflictError('Este código QR ya fue utilizado');
        }
        if (session.status === 'approved') {
            throw new app_error_1.ConflictError('Este código QR ya fue aprobado');
        }
        if (session.status === 'expired' || session.expiraEn.getTime() <= Date.now()) {
            if (session.status !== 'expired') {
                await prisma_1.prisma.qrLoginSession.update({
                    where: { idQrLoginSession: session.idQrLoginSession },
                    data: { status: 'expired' },
                });
            }
            throw new app_error_1.ConflictError('El código QR ha expirado. Genera uno nuevo en el dispositivo.');
        }
        if (session.status !== 'pending') {
            throw new app_error_1.ConflictError('La sesión QR no está disponible');
        }
        const token = this.tokens.sign({
            sub: String(user.idUsuario),
            username: user.username,
        });
        await prisma_1.prisma.qrLoginSession.update({
            where: { idQrLoginSession: session.idQrLoginSession },
            data: {
                status: 'approved',
                idUsuario: user.idUsuario,
                token,
                aprobadoEn: new Date(),
            },
        });
        return {
            ok: true,
            deviceName: session.deviceName,
        };
    }
    normalizeCode(raw) {
        const value = raw.trim();
        if (!value) {
            return null;
        }
        if (value.startsWith(create_qr_login_session_use_case_1.QR_LOGIN_PAYLOAD_PREFIX)) {
            const code = value.slice(create_qr_login_session_use_case_1.QR_LOGIN_PAYLOAD_PREFIX.length).trim();
            return code || null;
        }
        try {
            const parsed = JSON.parse(value);
            if (parsed?.t === 'device-link' && typeof parsed.c === 'string') {
                const code = parsed.c.trim();
                return code || null;
            }
        }
        catch {
            // plain code
        }
        if (/^[A-Za-z0-9_-]{16,64}$/.test(value)) {
            return value;
        }
        return null;
    }
}
exports.ApproveQrLoginSessionUseCase = ApproveQrLoginSessionUseCase;
//# sourceMappingURL=approve-qr-login-session.use-case.js.map