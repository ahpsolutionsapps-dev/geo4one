"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSuperAdminUser = isSuperAdminUser;
const roles_constants_1 = require("../../domain/constants/roles.constants");
async function isSuperAdminUser(prisma, idUsuario) {
    const row = await prisma.usuario.findUnique({
        where: { idUsuario },
        select: { rol: { select: { rol: true } } },
    });
    return (0, roles_constants_1.isSuperAdminRolName)(row?.rol?.rol ?? '');
}
//# sourceMappingURL=is-super-admin-user.js.map