"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUsuarioImagenUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
const entity_imagen_service_1 = require("../../../../shared/application/entity-imagen.service");
const usuarios_constants_1 = require("../../domain/constants/usuarios.constants");
const hide_super_admin_usuario_1 = require("../helpers/hide-super-admin-usuario");
const usuario_response_mapper_1 = require("../mappers/usuario-response.mapper");
class DeleteUsuarioImagenUseCase {
    usuarios;
    uploadService;
    constructor(usuarios, uploadService) {
        this.usuarios = usuarios;
        this.uploadService = uploadService;
    }
    async execute(idUsuario, idUsuarioModifica, options) {
        (0, usuarios_constants_1.assertUsuarioMutable)(idUsuario);
        const usuario = await this.usuarios.findById(idUsuario);
        if (!usuario || usuario.anulado) {
            throw new app_error_1.NotFoundError('Usuario no encontrado');
        }
        (0, hide_super_admin_usuario_1.assertUsuarioVisibleToActor)(usuario, options?.actorIsSuperAdmin === true);
        await (0, entity_imagen_service_1.deleteEntityImagenFile)(this.uploadService, usuario.imagen);
        const updated = await this.usuarios.update(idUsuario, {
            imagen: null,
            idUsuarioModifica,
        });
        return (0, usuario_response_mapper_1.toUsuarioResponse)(updated.toPrimitives());
    }
}
exports.DeleteUsuarioImagenUseCase = DeleteUsuarioImagenUseCase;
//# sourceMappingURL=delete-usuario-imagen.use-case.js.map