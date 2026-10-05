"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthNegocioId = getAuthNegocioId;
const prisma_1 = require("../../core/database/prisma");
const app_error_1 = require("../../core/errors/app-error");
const get_auth_user_id_1 = require("./get-auth-user-id");
async function getAuthNegocioId(req) {
    const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
    const user = await prisma_1.prisma.usuario.findUnique({
        where: { idUsuario },
        select: { idNegocio: true },
    });
    if (!user?.idNegocio) {
        throw new app_error_1.NotFoundError('Negocio del usuario no encontrado');
    }
    return user.idNegocio;
}
//# sourceMappingURL=get-auth-negocio-id.js.map