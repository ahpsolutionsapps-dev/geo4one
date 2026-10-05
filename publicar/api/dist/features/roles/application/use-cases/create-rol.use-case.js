"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRolUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
const roles_constants_1 = require("../../domain/constants/roles.constants");
const ensure_assignable_modulos_1 = require("../helpers/ensure-assignable-modulos");
class CreateRolUseCase {
    roles;
    modulos;
    constructor(roles, modulos) {
        this.roles = roles;
        this.modulos = modulos;
    }
    async execute(input) {
        const rol = input.rol.trim();
        const descripcion = input.descripcion.trim();
        const isSuperAdmin = input.isSuperAdmin === true;
        if (!isSuperAdmin && (0, roles_constants_1.isSuperAdminRolName)(rol)) {
            throw new app_error_1.ValidationError('No puedes crear el rol Super Administrador');
        }
        const idModulos = await (0, ensure_assignable_modulos_1.ensureAssignableModulos)(this.modulos, input.idModulos ?? [], { allowHidden: isSuperAdmin });
        const existing = await this.roles.findByNombre(rol, input.idNegocio);
        if (existing && !existing.toPrimitives().anulado) {
            throw new app_error_1.ConflictError('Ya existe un rol con ese nombre');
        }
        if (isSuperAdmin) {
            await this.modulos.enableByIds(idModulos);
        }
        const created = await this.roles.create({
            idNegocio: input.idNegocio,
            rol,
            descripcion,
            idUsuarioRegistra: input.idUsuarioRegistra,
            idModulos,
        });
        return created.toPrimitives();
    }
}
exports.CreateRolUseCase = CreateRolUseCase;
//# sourceMappingURL=create-rol.use-case.js.map