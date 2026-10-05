"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesController = void 0;
const prisma_1 = require("../../../../core/database/prisma");
const get_auth_negocio_id_1 = require("../../../../shared/presentation/get-auth-negocio-id");
const get_auth_user_id_1 = require("../../../../shared/presentation/get-auth-user-id");
const is_super_admin_user_1 = require("../../application/helpers/is-super-admin-user");
const roles_schemas_1 = require("../validators/roles.schemas");
const publish_realtime_event_1 = require("../../../../shared/infrastructure/events/publish-realtime-event");
const domain_event_1 = require("../../../../shared/infrastructure/events/domain-event");
class RolesController {
    getRoles;
    getRolById;
    createRol;
    updateRol;
    anularRol;
    getModulosCatalog;
    constructor(getRoles, getRolById, createRol, updateRol, anularRol, getModulosCatalog) {
        this.getRoles = getRoles;
        this.getRolById = getRolById;
        this.createRol = createRol;
        this.updateRol = updateRol;
        this.anularRol = anularRol;
        this.getModulosCatalog = getModulosCatalog;
    }
    list = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const idNegocio = await (0, get_auth_negocio_id_1.getAuthNegocioId)(req);
        const query = roles_schemas_1.getRolesQuerySchema.parse(req.query);
        const isSuperAdmin = await (0, is_super_admin_user_1.isSuperAdminUser)(prisma_1.prisma, idUsuario);
        const items = await this.getRoles.execute({
            includeAnulados: query.includeAnulados,
            excludeSuperAdmin: !isSuperAdmin,
            idNegocio,
        });
        res.status(200).json({ items });
    };
    listModulos = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const isSuperAdmin = await (0, is_super_admin_user_1.isSuperAdminUser)(prisma_1.prisma, idUsuario);
        const items = await this.getModulosCatalog.execute({
            includeHidden: isSuperAdmin,
        });
        res.status(200).json({ items });
    };
    getById = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const idNegocio = await (0, get_auth_negocio_id_1.getAuthNegocioId)(req);
        const params = roles_schemas_1.rolIdParamsSchema.parse(req.params);
        const isSuperAdmin = await (0, is_super_admin_user_1.isSuperAdminUser)(prisma_1.prisma, idUsuario);
        const item = await this.getRolById.execute(params.id, idNegocio, {
            includeHiddenModulos: isSuperAdmin,
            hideSuperAdmin: !isSuperAdmin,
        });
        res.status(200).json({ item });
    };
    create = async (req, res) => {
        const idUsuarioRegistra = (0, get_auth_user_id_1.getAuthUserId)(req);
        const idNegocio = await (0, get_auth_negocio_id_1.getAuthNegocioId)(req);
        const data = roles_schemas_1.createRolSchema.parse(req.body);
        const isSuperAdmin = await (0, is_super_admin_user_1.isSuperAdminUser)(prisma_1.prisma, idUsuarioRegistra);
        const item = await this.createRol.execute({
            idNegocio,
            rol: data.rol,
            descripcion: data.descripcion,
            idModulos: data.idModulos,
            idUsuarioRegistra,
            isSuperAdmin,
        });
        (0, publish_realtime_event_1.publishRealtimeEvent)(domain_event_1.RealtimeEvents.ROL_CREATED, { item });
        res.status(201).json({ item });
    };
    update = async (req, res) => {
        const idUsuarioModifica = (0, get_auth_user_id_1.getAuthUserId)(req);
        const idNegocio = await (0, get_auth_negocio_id_1.getAuthNegocioId)(req);
        const params = roles_schemas_1.rolIdParamsSchema.parse(req.params);
        const data = roles_schemas_1.updateRolSchema.parse(req.body);
        const isSuperAdmin = await (0, is_super_admin_user_1.isSuperAdminUser)(prisma_1.prisma, idUsuarioModifica);
        const item = await this.updateRol.execute(params.id, idNegocio, {
            rol: data.rol,
            descripcion: data.descripcion,
            idModulos: data.idModulos,
            comentario: data.comentario,
            idUsuarioModifica,
            isSuperAdmin,
        });
        (0, publish_realtime_event_1.publishRealtimeEvent)(domain_event_1.RealtimeEvents.ROL_UPDATED, { item });
        res.status(200).json({ item });
    };
    replaceModulos = async (req, res) => {
        const idUsuarioModifica = (0, get_auth_user_id_1.getAuthUserId)(req);
        const idNegocio = await (0, get_auth_negocio_id_1.getAuthNegocioId)(req);
        const params = roles_schemas_1.rolIdParamsSchema.parse(req.params);
        const data = roles_schemas_1.replaceRolModulosSchema.parse(req.body);
        const isSuperAdmin = await (0, is_super_admin_user_1.isSuperAdminUser)(prisma_1.prisma, idUsuarioModifica);
        const existing = await this.getRolById.execute(params.id, idNegocio, {
            includeHiddenModulos: isSuperAdmin,
            hideSuperAdmin: !isSuperAdmin,
        });
        const item = await this.updateRol.execute(params.id, idNegocio, {
            rol: existing.rol,
            descripcion: existing.descripcion,
            idModulos: data.idModulos,
            idUsuarioModifica,
            isSuperAdmin,
        });
        (0, publish_realtime_event_1.publishRealtimeEvent)(domain_event_1.RealtimeEvents.ROL_UPDATED, { item });
        res.status(200).json({ item });
    };
    remove = async (req, res) => {
        const idUsuarioAnula = (0, get_auth_user_id_1.getAuthUserId)(req);
        const idNegocio = await (0, get_auth_negocio_id_1.getAuthNegocioId)(req);
        const params = roles_schemas_1.rolIdParamsSchema.parse(req.params);
        const isSuperAdmin = await (0, is_super_admin_user_1.isSuperAdminUser)(prisma_1.prisma, idUsuarioAnula);
        await this.anularRol.execute(params.id, idNegocio, idUsuarioAnula, {
            isSuperAdmin,
        });
        (0, publish_realtime_event_1.publishRealtimeEvent)(domain_event_1.RealtimeEvents.ROL_DELETED, { id: String(params.id) });
        res.status(204).send();
    };
}
exports.RolesController = RolesController;
//# sourceMappingURL=roles.controller.js.map