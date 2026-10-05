"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUsuarioUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
const hide_super_admin_usuario_1 = require("../helpers/hide-super-admin-usuario");
const usuario_response_mapper_1 = require("../mappers/usuario-response.mapper");
class CreateUsuarioUseCase {
    usuarios;
    hasher;
    constructor(usuarios, hasher) {
        this.usuarios = usuarios;
        this.hasher = hasher;
    }
    async execute(input) {
        const username = input.username.trim();
        const email = input.email.trim().toLowerCase();
        await (0, hide_super_admin_usuario_1.assertAssignableRolForActor)(this.usuarios, input.idRol, input.actorIsSuperAdmin === true);
        const existingUsername = await this.usuarios.findByUsername(username);
        if (existingUsername && !existingUsername.anulado) {
            throw new app_error_1.ConflictError('Ya existe un usuario con ese nombre');
        }
        const existingEmail = await this.usuarios.findByEmail(email);
        if (existingEmail && !existingEmail.anulado) {
            throw new app_error_1.ConflictError('Ya existe un usuario con ese correo');
        }
        const { actorIsSuperAdmin: _actorIsSuperAdmin, ...createInput } = input;
        const userpassword = await this.hasher.hash(input.userpassword);
        const usuario = await this.usuarios.create({
            ...createInput,
            username,
            email,
            userpassword,
            palabraSecreta: input.palabraSecreta?.trim() || null,
            comentario: input.comentario?.trim() || null,
        });
        return (0, usuario_response_mapper_1.toUsuarioResponse)(usuario.toPrimitives());
    }
}
exports.CreateUsuarioUseCase = CreateUsuarioUseCase;
//# sourceMappingURL=create-usuario.use-case.js.map