"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUsuarioUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
const usuarios_constants_1 = require("../../domain/constants/usuarios.constants");
const hide_super_admin_usuario_1 = require("../helpers/hide-super-admin-usuario");
const usuario_response_mapper_1 = require("../mappers/usuario-response.mapper");
class UpdateUsuarioUseCase {
    usuarios;
    hasher;
    constructor(usuarios, hasher) {
        this.usuarios = usuarios;
        this.hasher = hasher;
    }
    async execute(idUsuario, input) {
        (0, usuarios_constants_1.assertUsuarioMutable)(idUsuario);
        const existing = await this.usuarios.findById(idUsuario);
        if (!existing || existing.anulado) {
            throw new app_error_1.NotFoundError('Usuario no encontrado');
        }
        const actorIsSuperAdmin = input.actorIsSuperAdmin === true;
        (0, hide_super_admin_usuario_1.assertUsuarioVisibleToActor)(existing, actorIsSuperAdmin);
        await (0, hide_super_admin_usuario_1.assertAssignableRolForActor)(this.usuarios, input.idRol, actorIsSuperAdmin);
        const username = input.username?.trim();
        if (username && username !== existing.toPrimitives().username) {
            const duplicate = await this.usuarios.findByUsername(username);
            if (duplicate && duplicate.idUsuario !== idUsuario && !duplicate.anulado) {
                throw new app_error_1.ConflictError('Ya existe un usuario con ese nombre');
            }
        }
        const email = input.email?.trim().toLowerCase();
        if (email && email !== existing.toPrimitives().email) {
            const duplicate = await this.usuarios.findByEmail(email);
            if (duplicate && duplicate.idUsuario !== idUsuario && !duplicate.anulado) {
                throw new app_error_1.ConflictError('Ya existe un usuario con ese correo');
            }
        }
        let userpassword;
        const plainPassword = input.userpassword?.trim();
        if (plainPassword) {
            if (plainPassword.length < 6) {
                throw new app_error_1.ValidationError('La contrasena debe tener al menos 6 caracteres');
            }
            userpassword = await this.hasher.hash(plainPassword);
        }
        const updated = await this.usuarios.update(idUsuario, {
            username,
            email,
            userpassword,
            idRol: input.idRol,
            palabraSecreta: input.palabraSecreta !== undefined
                ? input.palabraSecreta?.trim() || null
                : undefined,
            habilitado: input.habilitado,
            verificado: input.verificado,
            estatus: input.estatus,
            comentario: input.comentario !== undefined
                ? input.comentario?.trim() || null
                : undefined,
            idUsuarioModifica: input.idUsuarioModifica,
        });
        return (0, usuario_response_mapper_1.toUsuarioResponse)(updated.toPrimitives());
    }
}
exports.UpdateUsuarioUseCase = UpdateUsuarioUseCase;
//# sourceMappingURL=update-usuario.use-case.js.map