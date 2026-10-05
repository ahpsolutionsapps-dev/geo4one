"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRolByIdUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
const roles_constants_1 = require("../../domain/constants/roles.constants");
class GetRolByIdUseCase {
    roles;
    modulos;
    constructor(roles, modulos) {
        this.roles = roles;
        this.modulos = modulos;
    }
    async execute(idRol, idNegocio, options) {
        const rol = await this.roles.findById(idRol, idNegocio);
        if (!rol) {
            throw new app_error_1.NotFoundError('Rol no encontrado');
        }
        const props = rol.toPrimitives();
        if (options?.hideSuperAdmin === true && (0, roles_constants_1.isSuperAdminRolName)(props.rol)) {
            throw new app_error_1.NotFoundError('Rol no encontrado');
        }
        if (options?.includeHiddenModulos === true) {
            return props;
        }
        const hiddenIds = await this.modulos.findHiddenIds(props.idModulos);
        if (hiddenIds.length === 0) {
            return props;
        }
        const hiddenSet = new Set(hiddenIds);
        return {
            ...props,
            idModulos: props.idModulos.filter((idModulo) => !hiddenSet.has(idModulo)),
        };
    }
}
exports.GetRolByIdUseCase = GetRolByIdUseCase;
//# sourceMappingURL=get-rol-by-id.use-case.js.map