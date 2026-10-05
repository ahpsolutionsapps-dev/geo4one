"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRolUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
const roles_constants_1 = require("../../domain/constants/roles.constants");
const ensure_assignable_modulos_1 = require("../helpers/ensure-assignable-modulos");
class UpdateRolUseCase {
    roles;
    modulos;
    constructor(roles, modulos) {
        this.roles = roles;
        this.modulos = modulos;
    }
    async execute(idRol, idNegocio, input) {
        const existing = await this.roles.findById(idRol, idNegocio);
        if (!existing) {
            throw new app_error_1.NotFoundError('Rol no encontrado');
        }
        const existingProps = existing.toPrimitives();
        const rol = input.rol.trim();
        const descripcion = input.descripcion.trim();
        const isSuperAdmin = input.isSuperAdmin === true;
        if (!isSuperAdmin && (0, roles_constants_1.isSuperAdminRolName)(existingProps.rol)) {
            throw new app_error_1.NotFoundError('Rol no encontrado');
        }
        if (!isSuperAdmin && (0, roles_constants_1.isSuperAdminRolName)(rol)) {
            throw new app_error_1.ValidationError('No puedes asignar el nombre Super Administrador');
        }
        let idModulos = input.idModulos === undefined
            ? undefined
            : await (0, ensure_assignable_modulos_1.ensureAssignableModulos)(this.modulos, input.idModulos, {
                allowHidden: isSuperAdmin,
            });
        if ((0, roles_constants_1.isSuperAdminRolName)(existingProps.rol) && rol !== existingProps.rol) {
            throw new app_error_1.ConflictError('No se puede renombrar el rol Super Administrador');
        }
        const byName = await this.roles.findByNombre(rol, idNegocio);
        if (byName &&
            byName.toPrimitives().idRol !== idRol &&
            !byName.toPrimitives().anulado) {
            throw new app_error_1.ConflictError('Ya existe un rol con ese nombre');
        }
        if (idModulos !== undefined && !isSuperAdmin) {
            const hiddenAssigned = await this.modulos.findAssignedHiddenIds(idRol);
            idModulos = [...new Set([...idModulos, ...hiddenAssigned])];
        }
        if (idModulos !== undefined && isSuperAdmin) {
            const previouslyAssigned = new Set(existingProps.idModulos);
            const newlyAssigned = idModulos.filter((id) => !previouslyAssigned.has(id));
            await this.modulos.enableByIds(newlyAssigned);
        }
        const updated = await this.roles.update(idRol, idNegocio, {
            rol,
            descripcion,
            idUsuarioModifica: input.idUsuarioModifica,
            idModulos,
            comentario: input.comentario?.trim() || null,
        });
        return updated.toPrimitives();
    }
}
exports.UpdateRolUseCase = UpdateRolUseCase;
//# sourceMappingURL=update-rol.use-case.js.map