"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireVerifiedMiddleware = requireVerifiedMiddleware;
const app_error_1 = require("../../../../core/errors/app-error");
function requireVerifiedMiddleware(users) {
    return async (req, _res, next) => {
        try {
            const sub = req.auth?.sub;
            if (!sub) {
                next(new app_error_1.UnauthorizedError('Token no provisto'));
                return;
            }
            const idUsuario = Number(sub);
            if (!Number.isFinite(idUsuario)) {
                next(new app_error_1.UnauthorizedError('Token inválido'));
                return;
            }
            const user = await users.findById(idUsuario);
            if (!user) {
                next(new app_error_1.UnauthorizedError());
                return;
            }
            if (user.anulado) {
                next(new app_error_1.ForbiddenError('Tu cuenta ha sido anulada. Contacta al administrador.', 'ACCOUNT_ANNULLED'));
                return;
            }
            if (!user.habilitado) {
                next(new app_error_1.ForbiddenError('Tu cuenta está deshabilitada. Contacta al administrador.', 'ACCOUNT_DISABLED'));
                return;
            }
            if (user.verificado !== true) {
                next(new app_error_1.ForbiddenError('Tu cuenta no está verificada. Contacta al administrador para habilitar el acceso.', 'ACCOUNT_NOT_VERIFIED'));
                return;
            }
            next();
        }
        catch (err) {
            next(err);
        }
    };
}
//# sourceMappingURL=require-verified.middleware.js.map