"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodosColocacionController = void 0;
const get_auth_user_id_1 = require("../../../../shared/presentation/get-auth-user-id");
const periodos_colocacion_schemas_1 = require("../validators/periodos-colocacion.schemas");
class PeriodosColocacionController {
    getPeriodosColocacion;
    getPeriodoColocacionById;
    createPeriodoColocacion;
    updatePeriodoColocacion;
    deactivatePeriodoColocacion;
    constructor(getPeriodosColocacion, getPeriodoColocacionById, createPeriodoColocacion, updatePeriodoColocacion, deactivatePeriodoColocacion) {
        this.getPeriodosColocacion = getPeriodosColocacion;
        this.getPeriodoColocacionById = getPeriodoColocacionById;
        this.createPeriodoColocacion = createPeriodoColocacion;
        this.updatePeriodoColocacion = updatePeriodoColocacion;
        this.deactivatePeriodoColocacion = deactivatePeriodoColocacion;
    }
    list = async (_req, res) => {
        const items = await this.getPeriodosColocacion.execute();
        res.status(200).json({ items });
    };
    getById = async (req, res) => {
        const params = periodos_colocacion_schemas_1.periodoColocacionIdParamsSchema.parse(req.params);
        const item = await this.getPeriodoColocacionById.execute(params.id);
        res.status(200).json({ item });
    };
    create = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const data = periodos_colocacion_schemas_1.createPeriodoColocacionSchema.parse(req.body);
        const item = await this.createPeriodoColocacion.execute({
            fechaInicial: data.fechaInicial,
            fechaFinal: data.fechaFinal,
            generalesSeguimiento: data.generalesSeguimiento,
            creadoPor: idUsuario,
        });
        res.status(201).json({ item });
    };
    update = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = periodos_colocacion_schemas_1.periodoColocacionIdParamsSchema.parse(req.params);
        const data = periodos_colocacion_schemas_1.updatePeriodoColocacionSchema.parse(req.body);
        const item = await this.updatePeriodoColocacion.execute(params.id, {
            fechaInicial: data.fechaInicial,
            fechaFinal: data.fechaFinal,
            generalesSeguimiento: data.generalesSeguimiento,
            activo: data.activo,
            actualizadoPor: idUsuario,
        });
        res.status(200).json({ item });
    };
    remove = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = periodos_colocacion_schemas_1.periodoColocacionIdParamsSchema.parse(req.params);
        await this.deactivatePeriodoColocacion.execute(params.id, idUsuario);
        res.status(204).send();
    };
}
exports.PeriodosColocacionController = PeriodosColocacionController;
//# sourceMappingURL=periodos-colocacion.controller.js.map