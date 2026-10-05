"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarcasAguaSeguimientoController = void 0;
const get_auth_user_id_1 = require("../../../../shared/presentation/get-auth-user-id");
const marcas_agua_seguimiento_schemas_1 = require("../validators/marcas-agua-seguimiento.schemas");
class MarcasAguaSeguimientoController {
    getMarcasAguaSeguimiento;
    getMarcaAguaSeguimientoById;
    getVersionesCampanaOptions;
    createMarcaAguaSeguimiento;
    updateMarcaAguaSeguimiento;
    deactivateMarcaAguaSeguimiento;
    constructor(getMarcasAguaSeguimiento, getMarcaAguaSeguimientoById, getVersionesCampanaOptions, createMarcaAguaSeguimiento, updateMarcaAguaSeguimiento, deactivateMarcaAguaSeguimiento) {
        this.getMarcasAguaSeguimiento = getMarcasAguaSeguimiento;
        this.getMarcaAguaSeguimientoById = getMarcaAguaSeguimientoById;
        this.getVersionesCampanaOptions = getVersionesCampanaOptions;
        this.createMarcaAguaSeguimiento = createMarcaAguaSeguimiento;
        this.updateMarcaAguaSeguimiento = updateMarcaAguaSeguimiento;
        this.deactivateMarcaAguaSeguimiento = deactivateMarcaAguaSeguimiento;
    }
    list = async (_req, res) => {
        const items = await this.getMarcasAguaSeguimiento.execute();
        res.status(200).json({ items });
    };
    getById = async (req, res) => {
        const params = marcas_agua_seguimiento_schemas_1.marcaAguaSeguimientoIdParamsSchema.parse(req.params);
        const item = await this.getMarcaAguaSeguimientoById.execute(params.id);
        res.status(200).json({ item });
    };
    listVersionesOptions = async (_req, res) => {
        const items = await this.getVersionesCampanaOptions.execute();
        res.status(200).json({ items });
    };
    create = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const data = marcas_agua_seguimiento_schemas_1.createMarcaAguaSeguimientoSchema.parse(req.body);
        const item = await this.createMarcaAguaSeguimiento.execute({
            idVersionCampana: data.idVersionCampana,
            imagenMuestra: data.imagenMuestra,
            videoMuestra: data.videoMuestra,
            creadoPor: idUsuario,
        });
        res.status(201).json({ item });
    };
    update = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = marcas_agua_seguimiento_schemas_1.marcaAguaSeguimientoIdParamsSchema.parse(req.params);
        const data = marcas_agua_seguimiento_schemas_1.updateMarcaAguaSeguimientoSchema.parse(req.body);
        const item = await this.updateMarcaAguaSeguimiento.execute(params.id, {
            idVersionCampana: data.idVersionCampana,
            imagenMuestra: data.imagenMuestra,
            videoMuestra: data.videoMuestra,
            activo: data.activo,
            actualizadoPor: idUsuario,
        });
        res.status(200).json({ item });
    };
    remove = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = marcas_agua_seguimiento_schemas_1.marcaAguaSeguimientoIdParamsSchema.parse(req.params);
        await this.deactivateMarcaAguaSeguimiento.execute(params.id, idUsuario);
        res.status(204).send();
    };
}
exports.MarcasAguaSeguimientoController = MarcasAguaSeguimientoController;
//# sourceMappingURL=marcas-agua-seguimiento.controller.js.map