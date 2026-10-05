"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnularRolUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
const roles_constants_1 = require("../../domain/constants/roles.constants");
class AnularRolUseCase {
    roles;
    constructor(roles) {
        this.roles = roles;
    }
    async execute(idRol, idNegocio, idUsuarioAnula, options) {
        const existing = await this.roles.findById(idRol, idNegocio);
        if (!existing) {
            throw new app_error_1.NotFoundError('Rol no encontrado');
        }
        const props = existing.toPrimitives();
        if (options?.isSuperAdmin !== true && (0, roles_constants_1.isSuperAdminRolName)(props.rol)) {
            throw new app_error_1.NotFoundError('Rol no encontrado');
        }
        (0, roles_constants_1.assertRolMutable)(props);
        if (props.anulado) {
            return;
        }
        await this.roles.softDelete(idRol, idNegocio, idUsuarioAnula);
    }
}
exports.AnularRolUseCase = AnularRolUseCase;
//# sourceMappingURL=anular-rol.use-case.js.map