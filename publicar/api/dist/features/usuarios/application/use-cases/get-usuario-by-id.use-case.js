"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsuarioByIdUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
const hide_super_admin_usuario_1 = require("../helpers/hide-super-admin-usuario");
const usuario_response_mapper_1 = require("../mappers/usuario-response.mapper");
class GetUsuarioByIdUseCase {
    usuarios;
    constructor(usuarios) {
        this.usuarios = usuarios;
    }
    async execute(idUsuario, options) {
        const usuario = await this.usuarios.findById(idUsuario);
        if (!usuario || usuario.anulado) {
            throw new app_error_1.NotFoundError('Usuario no encontrado');
        }
        (0, hide_super_admin_usuario_1.assertUsuarioVisibleToActor)(usuario, options?.actorIsSuperAdmin === true);
        return (0, usuario_response_mapper_1.toUsuarioResponse)(usuario.toPrimitives());
    }
}
exports.GetUsuarioByIdUseCase = GetUsuarioByIdUseCase;
//# sourceMappingURL=get-usuario-by-id.use-case.js.map