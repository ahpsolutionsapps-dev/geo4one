"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnularUsuarioUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
const usuarios_constants_1 = require("../../domain/constants/usuarios.constants");
const hide_super_admin_usuario_1 = require("../helpers/hide-super-admin-usuario");
class AnularUsuarioUseCase {
    usuarios;
    constructor(usuarios) {
        this.usuarios = usuarios;
    }
    async execute(idUsuario, idUsuarioAnula, options) {
        (0, usuarios_constants_1.assertUsuarioMutable)(idUsuario);
        const existing = await this.usuarios.findById(idUsuario);
        if (!existing) {
            throw new app_error_1.NotFoundError('Usuario no encontrado');
        }
        (0, hide_super_admin_usuario_1.assertUsuarioVisibleToActor)(existing, options?.actorIsSuperAdmin === true);
        if (existing.anulado) {
            return;
        }
        await this.usuarios.softDelete(idUsuario, idUsuarioAnula);
    }
}
exports.AnularUsuarioUseCase = AnularUsuarioUseCase;
//# sourceMappingURL=anular-usuario.use-case.js.map