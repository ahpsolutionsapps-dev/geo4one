"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionesCampanasController = void 0;
const get_auth_user_id_1 = require("../../../../shared/presentation/get-auth-user-id");
const versiones_campanas_schemas_1 = require("../validators/versiones-campanas.schemas");
class VersionesCampanasController {
    getVersionesCampanas;
    getVersionCampanaById;
    getAnunciantesOptions;
    getMarcasProductosOptions;
    getCombosAnunciantesOptions;
    createVersionCampana;
    updateVersionCampana;
    deactivateVersionCampana;
    constructor(getVersionesCampanas, getVersionCampanaById, getAnunciantesOptions, getMarcasProductosOptions, getCombosAnunciantesOptions, createVersionCampana, updateVersionCampana, deactivateVersionCampana) {
        this.getVersionesCampanas = getVersionesCampanas;
        this.getVersionCampanaById = getVersionCampanaById;
        this.getAnunciantesOptions = getAnunciantesOptions;
        this.getMarcasProductosOptions = getMarcasProductosOptions;
        this.getCombosAnunciantesOptions = getCombosAnunciantesOptions;
        this.createVersionCampana = createVersionCampana;
        this.updateVersionCampana = updateVersionCampana;
        this.deactivateVersionCampana = deactivateVersionCampana;
    }
    list = async (_req, res) => {
        const items = await this.getVersionesCampanas.execute();
        res.status(200).json({ items });
    };
    getById = async (req, res) => {
        const params = versiones_campanas_schemas_1.versionCampanaIdParamsSchema.parse(req.params);
        const item = await this.getVersionCampanaById.execute(params.id);
        res.status(200).json({ item });
    };
    listAnunciantesOptions = async (_req, res) => {
        const items = await this.getAnunciantesOptions.execute();
        res.status(200).json({ items });
    };
    listMarcasProductosOptions = async (req, res) => {
        const query = versiones_campanas_schemas_1.marcasProductoOptionsQuerySchema.parse(req.query);
        const items = await this.getMarcasProductosOptions.execute(query.idAnunciante);
        res.status(200).json({ items });
    };
    listCombosAnunciantesOptions = async (_req, res) => {
        const items = await this.getCombosAnunciantesOptions.execute();
        res.status(200).json({ items });
    };
    create = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const data = versiones_campanas_schemas_1.createVersionCampanaSchema.parse(req.body);
        const item = await this.createVersionCampana.execute({
            idAnunciante: data.idAnunciante,
            idMarcaProducto: data.idMarcaProducto,
            idComboAnunciante: data.idComboAnunciante,
            versionCampana: data.versionCampana,
            leyendaSeguimiento: data.leyendaSeguimiento,
            creadoPor: idUsuario,
        });
        res.status(201).json({ item });
    };
    update = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = versiones_campanas_schemas_1.versionCampanaIdParamsSchema.parse(req.params);
        const data = versiones_campanas_schemas_1.updateVersionCampanaSchema.parse(req.body);
        const item = await this.updateVersionCampana.execute(params.id, {
            idAnunciante: data.idAnunciante,
            idMarcaProducto: data.idMarcaProducto,
            idComboAnunciante: data.idComboAnunciante,
            versionCampana: data.versionCampana,
            leyendaSeguimiento: data.leyendaSeguimiento,
            activo: data.activo,
            actualizadoPor: idUsuario,
        });
        res.status(200).json({ item });
    };
    remove = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = versiones_campanas_schemas_1.versionCampanaIdParamsSchema.parse(req.params);
        await this.deactivateVersionCampana.execute(params.id, idUsuario);
        res.status(204).send();
    };
}
exports.VersionesCampanasController = VersionesCampanasController;
//# sourceMappingURL=versiones-campanas.controller.js.map