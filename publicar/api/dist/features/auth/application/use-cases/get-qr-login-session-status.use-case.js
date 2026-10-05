"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetQrLoginSessionStatusUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
const prisma_1 = require("../../../../core/database/prisma");
class GetQrLoginSessionStatusUseCase {
    users;
    constructor(users) {
        this.users = users;
    }
    async execute(code) {
        const session = await prisma_1.prisma.qrLoginSession.findFirst({
            where: { code },
        });
        if (!session) {
            throw new app_error_1.NotFoundError('Sesión QR no encontrada');
        }
        if (session.status === 'consumed') {
            return {
                status: 'consumed',
                expiresAt: session.expiraEn.toISOString(),
            };
        }
        if (session.status === 'expired' || session.expiraEn.getTime() <= Date.now()) {
            if (session.status !== 'expired') {
                await prisma_1.prisma.qrLoginSession.update({
                    where: { idQrLoginSession: session.idQrLoginSession },
                    data: { status: 'expired' },
                });
            }
            return {
                status: 'expired',
                expiresAt: session.expiraEn.toISOString(),
            };
        }
        if (session.status === 'pending') {
            return {
                status: 'pending',
                expiresAt: session.expiraEn.toISOString(),
            };
        }
        if (session.status === 'approved' && session.idUsuario && session.token) {
            const user = await this.users.findById(session.idUsuario);
            if (!user || !user.canLogin()) {
                await prisma_1.prisma.qrLoginSession.update({
                    where: { idQrLoginSession: session.idQrLoginSession },
                    data: { status: 'expired', token: null },
                });
                return {
                    status: 'expired',
                    expiresAt: session.expiraEn.toISOString(),
                };
            }
            await prisma_1.prisma.qrLoginSession.update({
                where: { idQrLoginSession: session.idQrLoginSession },
                data: {
                    status: 'consumed',
                    consumidoEn: new Date(),
                    token: null,
                },
            });
            return {
                status: 'approved',
                expiresAt: session.expiraEn.toISOString(),
                user: user.toPublic(),
                token: session.token,
            };
        }
        return {
            status: 'expired',
            expiresAt: session.expiraEn.toISOString(),
        };
    }
}
exports.GetQrLoginSessionStatusUseCase = GetQrLoginSessionStatusUseCase;
//# sourceMappingURL=get-qr-login-session-status.use-case.js.map