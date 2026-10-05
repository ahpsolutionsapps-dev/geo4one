"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColocacionesController = void 0;
const get_auth_user_id_1 = require("../../../../shared/presentation/get-auth-user-id");
const colocaciones_schemas_1 = require("../validators/colocaciones.schemas");
class ColocacionesController {
    getColocaciones;
    getColocacionById;
    getElementosOptions;
    getVersionesCampanaOptions;
    getPeriodosOptions;
    createColocacion;
    updateColocacion;
    deactivateColocacion;
    constructor(getColocaciones, getColocacionById, getElementosOptions, getVersionesCampanaOptions, getPeriodosOptions, createColocacion, updateColocacion, deactivateColocacion) {
        this.getColocaciones = getColocaciones;
        this.getColocacionById = getColocacionById;
        this.getElementosOptions = getElementosOptions;
        this.getVersionesCampanaOptions = getVersionesCampanaOptions;
        this.getPeriodosOptions = getPeriodosOptions;
        this.createColocacion = createColocacion;
        this.updateColocacion = updateColocacion;
        this.deactivateColocacion = deactivateColocacion;
    }
    list = async (_req, res) => {
        const items = await this.getColocaciones.execute();
        res.status(200).json({ items });
    };
    getById = async (req, res) => {
        const params = colocaciones_schemas_1.colocacionIdParamsSchema.parse(req.params);
        const item = await this.getColocacionById.execute(params.id);
        res.status(200).json({ item });
    };
    listElementosOptions = async (_req, res) => {
        const items = await this.getElementosOptions.execute();
        res.status(200).json({ items });
    };
    listVersionesCampanaOptions = async (_req, res) => {
        const items = await this.getVersionesCampanaOptions.execute();
        res.status(200).json({ items });
    };
    listPeriodosOptions = async (_req, res) => {
        const items = await this.getPeriodosOptions.execute();
        res.status(200).json({ items });
    };
    create = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const data = colocaciones_schemas_1.createColocacionSchema.parse(req.body);
        const item = await this.createColocacion.execute({
            codigoSeguimiento: data.codigoSeguimiento,
            idElemento: data.idElemento,
            idVersionCampana: data.idVersionCampana,
            idPeriodoColocacion: data.idPeriodoColocacion,
            observaciones: data.observaciones,
            creadoPor: idUsuario,
        });
        res.status(201).json({ item });
    };
    update = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = colocaciones_schemas_1.colocacionIdParamsSchema.parse(req.params);
        const data = colocaciones_schemas_1.updateColocacionSchema.parse(req.body);
        const item = await this.updateColocacion.execute(params.id, {
            codigoSeguimiento: data.codigoSeguimiento,
            idElemento: data.idElemento,
            idVersionCampana: data.idVersionCampana,
            idPeriodoColocacion: data.idPeriodoColocacion,
            observaciones: data.observaciones,
            activo: data.activo,
            actualizadoPor: idUsuario,
        });
        res.status(200).json({ item });
    };
    remove = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = colocaciones_schemas_1.colocacionIdParamsSchema.parse(req.params);
        await this.deactivateColocacion.execute(params.id, idUsuario);
        res.status(204).send();
    };
}
exports.ColocacionesController = ColocacionesController;
//# sourceMappingURL=colocaciones.controller.js.map