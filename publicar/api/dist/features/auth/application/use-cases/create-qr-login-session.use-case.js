"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateQrLoginSessionUseCase = exports.QR_LOGIN_PAYLOAD_PREFIX = void 0;
const crypto_1 = require("crypto");
const prisma_1 = require("../../../../core/database/prisma");
const SESSION_TTL_MS = 2 * 60 * 1000;
exports.QR_LOGIN_PAYLOAD_PREFIX = 'AGN_DEVICE_LINK:v1:';
class CreateQrLoginSessionUseCase {
    async execute(input) {
        const code = (0, crypto_1.randomBytes)(24).toString('base64url');
        const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
        await prisma_1.prisma.qrLoginSession.create({
            data: {
                code,
                status: 'pending',
                deviceName: input?.deviceName?.trim() || null,
                expiraEn: expiresAt,
            },
        });
        return {
            code,
            payload: `${exports.QR_LOGIN_PAYLOAD_PREFIX}${code}`,
            expiresAt: expiresAt.toISOString(),
            expiresInSeconds: Math.floor(SESSION_TTL_MS / 1000),
        };
    }
}
exports.CreateQrLoginSessionUseCase = CreateQrLoginSessionUseCase;
//# sourceMappingURL=create-qr-login-session.use-case.js.map