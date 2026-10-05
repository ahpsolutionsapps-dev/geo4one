"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosController = void 0;
const prisma_1 = require("../../../../core/database/prisma");
const app_error_1 = require("../../../../core/errors/app-error");
const get_auth_negocio_id_1 = require("../../../../shared/presentation/get-auth-negocio-id");
const get_auth_user_id_1 = require("../../../../shared/presentation/get-auth-user-id");
const is_super_admin_user_1 = require("../../../roles/application/helpers/is-super-admin-user");
const usuarios_schemas_1 = require("../validators/usuarios.schemas");
const domain_event_1 = require("../../../../shared/infrastructure/events/domain-event");
const publish_realtime_event_1 = require("../../../../shared/infrastructure/events/publish-realtime-event");
function toBooleanFlag(value) {
    if (value === undefined) {
        return undefined;
    }
    return value === 1;
}
class UsuariosController {
    getUsuarios;
    getUsuarioById;
    createUsuario;
    updateUsuario;
    anularUsuario;
    uploadUsuarioImagen;
    deleteUsuarioImagen;
    constructor(getUsuarios, getUsuarioById, createUsuario, updateUsuario, anularUsuario, uploadUsuarioImagen, deleteUsuarioImagen) {
        this.getUsuarios = getUsuarios;
        this.getUsuarioById = getUsuarioById;
        this.createUsuario = createUsuario;
        this.updateUsuario = updateUsuario;
        this.anularUsuario = anularUsuario;
        this.uploadUsuarioImagen = uploadUsuarioImagen;
        this.deleteUsuarioImagen = deleteUsuarioImagen;
    }
    list = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const query = usuarios_schemas_1.getUsuariosQuerySchema.parse(req.query);
        const isSuperAdmin = await (0, is_super_admin_user_1.isSuperAdminUser)(prisma_1.prisma, idUsuario);
        const items = await this.getUsuarios.execute({
            includeAnulados: query.includeAnulados,
            excludeSuperAdmin: !isSuperAdmin,
        });
        res.status(200).json({ items });
    };
    getById = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = usuarios_schemas_1.usuarioIdParamsSchema.parse(req.params);
        const isSuperAdmin = await (0, is_super_admin_user_1.isSuperAdminUser)(prisma_1.prisma, idUsuario);
        const item = await this.getUsuarioById.execute(params.id, {
            actorIsSuperAdmin: isSuperAdmin,
        });
        res.status(200).json({ item });
    };
    create = async (req, res) => {
        const idUsuarioRegistra = (0, get_auth_user_id_1.getAuthUserId)(req);
        const idNegocio = await (0, get_auth_negocio_id_1.getAuthNegocioId)(req);
        const data = usuarios_schemas_1.createUsuarioSchema.parse(req.body);
        const isSuperAdmin = await (0, is_super_admin_user_1.isSuperAdminUser)(prisma_1.prisma, idUsuarioRegistra);
        const item = await this.createUsuario.execute({
            idNegocio,
            username: data.username,
            email: data.email,
            userpassword: data.userpassword,
            nombre: data.nombre,
            apellido: data.apellido ?? null,
            telefono: data.telefono ?? null,
            idRol: data.idRol ?? null,
            palabraSecreta: data.palabraSecreta ?? null,
            habilitado: toBooleanFlag(data.habilitado) ?? true,
            verificado: toBooleanFlag(data.verificado) ?? false,
            estatus: data.estatus ?? 1,
            idioma: data.idioma,
            tema: data.tema,
            comentario: data.comentario ?? null,
            idUsuarioRegistra,
            actorIsSuperAdmin: isSuperAdmin,
        });
        (0, publish_realtime_event_1.publishRealtimeEvent)(domain_event_1.RealtimeEvents.USUARIO_CREATED, { item });
        res.status(201).json({ item });
    };
    update = async (req, res) => {
        const idUsuarioModifica = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = usuarios_schemas_1.usuarioIdParamsSchema.parse(req.params);
        const data = usuarios_schemas_1.updateUsuarioSchema.parse(req.body);
        const isSuperAdmin = await (0, is_super_admin_user_1.isSuperAdminUser)(prisma_1.prisma, idUsuarioModifica);
        const item = await this.updateUsuario.execute(params.id, {
            username: data.username,
            email: data.email,
            userpassword: data.userpassword ?? null,
            nombre: data.nombre,
            apellido: data.apellido,
            telefono: data.telefono,
            idRol: data.idRol,
            palabraSecreta: data.palabraSecreta,
            habilitado: toBooleanFlag(data.habilitado),
            verificado: toBooleanFlag(data.verificado),
            estatus: data.estatus,
            idioma: data.idioma,
            tema: data.tema,
            comentario: data.comentario,
            idUsuarioModifica,
            actorIsSuperAdmin: isSuperAdmin,
        });
        (0, publish_realtime_event_1.publishRealtimeEvent)(domain_event_1.RealtimeEvents.USUARIO_UPDATED, { item });
        res.status(200).json({ item });
    };
    remove = async (req, res) => {
        const idUsuarioAnula = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = usuarios_schemas_1.usuarioIdParamsSchema.parse(req.params);
        const isSuperAdmin = await (0, is_super_admin_user_1.isSuperAdminUser)(prisma_1.prisma, idUsuarioAnula);
        await this.anularUsuario.execute(params.id, idUsuarioAnula, {
            actorIsSuperAdmin: isSuperAdmin,
        });
        (0, publish_realtime_event_1.publishRealtimeEvent)(domain_event_1.RealtimeEvents.USUARIO_DELETED, { id: String(params.id) });
        res.status(204).send();
    };
    uploadImagen = async (req, res) => {
        const idUsuarioModifica = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = usuarios_schemas_1.usuarioIdParamsSchema.parse(req.params);
        if (!req.file) {
            throw new app_error_1.ValidationError('Imagen requerida en campo "imagen"');
        }
        const isSuperAdmin = await (0, is_super_admin_user_1.isSuperAdminUser)(prisma_1.prisma, idUsuarioModifica);
        const item = await this.uploadUsuarioImagen.execute({
            idUsuario: params.id,
            buffer: req.file.buffer,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            idUsuarioModifica,
            actorIsSuperAdmin: isSuperAdmin,
        });
        (0, publish_realtime_event_1.publishRealtimeEvent)(domain_event_1.RealtimeEvents.USUARIO_UPDATED, { item });
        res.status(200).json({ item });
    };
    removeImagen = async (req, res) => {
        const idUsuarioModifica = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = usuarios_schemas_1.usuarioIdParamsSchema.parse(req.params);
        const isSuperAdmin = await (0, is_super_admin_user_1.isSuperAdminUser)(prisma_1.prisma, idUsuarioModifica);
        const item = await this.deleteUsuarioImagen.execute(params.id, idUsuarioModifica, {
            actorIsSuperAdmin: isSuperAdmin,
        });
        (0, publish_realtime_event_1.publishRealtimeEvent)(domain_event_1.RealtimeEvents.USUARIO_UPDATED, { item });
        res.status(200).json({ item });
    };
}
exports.UsuariosController = UsuariosController;
//# sourceMappingURL=usuarios.controller.js.map