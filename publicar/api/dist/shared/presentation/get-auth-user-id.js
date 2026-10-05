"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthUserId = getAuthUserId;
const app_error_1 = require("../../core/errors/app-error");
function getAuthUserId(req) {
    const sub = req.auth?.sub;
    if (!sub) {
        throw new app_error_1.UnauthorizedError();
    }
    const idUsuario = Number(sub);
    if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
        throw new app_error_1.UnauthorizedError('Token inválido');
    }
    return idUsuario;
}
//# sourceMappingURL=get-auth-user-id.js.map