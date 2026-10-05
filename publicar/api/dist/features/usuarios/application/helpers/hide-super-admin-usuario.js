"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertUsuarioVisibleToActor = assertUsuarioVisibleToActor;
exports.assertAssignableRolForActor = assertAssignableRolForActor;
const app_error_1 = require("../../../../core/errors/app-error");
const roles_constants_1 = require("../../../roles/domain/constants/roles.constants");
function assertUsuarioVisibleToActor(usuario, actorIsSuperAdmin) {
    if (actorIsSuperAdmin) {
        return;
    }
    if ((0, roles_constants_1.isSuperAdminRolName)(usuario.toPrimitives().rol ?? '')) {
        throw new app_error_1.NotFoundError('Usuario no encontrado');
    }
}
async function assertAssignableRolForActor(usuarios, idRol, actorIsSuperAdmin) {
    if (actorIsSuperAdmin || idRol == null) {
        return;
    }
    const rolName = await usuarios.findRolNameById(idRol);
    if (rolName && (0, roles_constants_1.isSuperAdminRolName)(rolName)) {
        throw new app_error_1.ValidationError('No puedes asignar el rol Super Administrador');
    }
}
//# sourceMappingURL=hide-super-admin-usuario.js.map