"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRIVILEGED_DASHBOARD_ROL_IDS = exports.ADMIN_ROL_NAMES = exports.SUPER_ADMIN_ROL_NAME = void 0;
exports.isSuperAdminRolName = isSuperAdminRolName;
exports.isAdminRolName = isAdminRolName;
exports.isPrivilegedDashboardRolId = isPrivilegedDashboardRolId;
exports.assertRolMutable = assertRolMutable;
const app_error_1 = require("../../../../core/errors/app-error");
exports.SUPER_ADMIN_ROL_NAME = 'Super Administrador';
exports.ADMIN_ROL_NAMES = ['Super Administrador', 'Administrador'];
exports.PRIVILEGED_DASHBOARD_ROL_IDS = [1, 2];
function isSuperAdminRolName(rol) {
    return rol.trim().toLowerCase() === exports.SUPER_ADMIN_ROL_NAME.toLowerCase();
}
function isAdminRolName(rol) {
    const normalized = rol.trim().toLowerCase();
    return exports.ADMIN_ROL_NAMES.some((name) => name.toLowerCase() === normalized);
}
function isPrivilegedDashboardRolId(idRol) {
    if (idRol == null) {
        return false;
    }
    return exports.PRIVILEGED_DASHBOARD_ROL_IDS.includes(idRol);
}
function assertRolMutable(rol) {
    if (isSuperAdminRolName(rol.rol)) {
        throw new app_error_1.ValidationError('El rol Super Administrador no puede anularse ni modificarse de forma destructiva');
    }
}
//# sourceMappingURL=roles.constants.js.map