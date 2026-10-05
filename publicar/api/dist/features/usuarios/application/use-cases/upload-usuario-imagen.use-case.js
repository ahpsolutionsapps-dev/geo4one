"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadUsuarioImagenUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
const entity_imagen_service_1 = require("../../../../shared/application/entity-imagen.service");
const usuarios_constants_1 = require("../../domain/constants/usuarios.constants");
const hide_super_admin_usuario_1 = require("../helpers/hide-super-admin-usuario");
const usuario_response_mapper_1 = require("../mappers/usuario-response.mapper");
class UploadUsuarioImagenUseCase {
    usuarios;
    uploadService;
    constructor(usuarios, uploadService) {
        this.usuarios = usuarios;
        this.uploadService = uploadService;
    }
    async execute(input) {
        (0, usuarios_constants_1.assertUsuarioMutable)(input.idUsuario);
        const usuario = await this.usuarios.findById(input.idUsuario);
        if (!usuario || usuario.anulado) {
            throw new app_error_1.NotFoundError('Usuario no encontrado');
        }
        (0, hide_super_admin_usuario_1.assertUsuarioVisibleToActor)(usuario, input.actorIsSuperAdmin === true);
        const url = await (0, entity_imagen_service_1.uploadEntityImagen)(this.uploadService, {
            buffer: input.buffer,
            originalName: input.originalName,
            mimeType: input.mimeType,
            currentImagenUrl: usuario.imagen,
            category: 'usuarios',
            tag: `usuario-${input.idUsuario}`,
        });
        const updated = await this.usuarios.update(input.idUsuario, {
            imagen: url,
            idUsuarioModifica: input.idUsuarioModifica,
        });
        return (0, usuario_response_mapper_1.toUsuarioResponse)(updated.toPrimitives());
    }
}
exports.UploadUsuarioImagenUseCase = UploadUsuarioImagenUseCase;
//# sourceMappingURL=upload-usuario-imagen.use-case.js.map