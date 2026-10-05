"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePrivilegedDashboardRolMiddleware = requirePrivilegedDashboardRolMiddleware;
const app_error_1 = require("../../../../core/errors/app-error");
const roles_constants_1 = require("../../../roles/domain/constants/roles.constants");
function requirePrivilegedDashboardRolMiddleware(users) {
    return async (req, _res, next) => {
        try {
            const sub = req.auth?.sub;
            if (!sub) {
                next(new app_error_1.UnauthorizedError('Token no provisto'));
                return;
            }
            const idUsuario = Number(sub);
            if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
                next(new app_error_1.UnauthorizedError('Token inválido'));
                return;
            }
            const user = await users.findById(idUsuario);
            if (!user || !(0, roles_constants_1.isPrivilegedDashboardRolId)(user.idRol)) {
                next(new app_error_1.ForbiddenError('Acceso restringido al dashboard completo'));
                return;
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=require-privileged-dashboard-rol.middleware.js.map