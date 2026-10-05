"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombosAnunciantesController = void 0;
const get_auth_user_id_1 = require("../../../../shared/presentation/get-auth-user-id");
const combos_anunciantes_schemas_1 = require("../validators/combos-anunciantes.schemas");
class CombosAnunciantesController {
    getCombosAnunciantes;
    getComboAnuncianteById;
    getComboMarcasOptions;
    createComboAnunciante;
    updateComboAnunciante;
    deactivateComboAnunciante;
    constructor(getCombosAnunciantes, getComboAnuncianteById, getComboMarcasOptions, createComboAnunciante, updateComboAnunciante, deactivateComboAnunciante) {
        this.getCombosAnunciantes = getCombosAnunciantes;
        this.getComboAnuncianteById = getComboAnuncianteById;
        this.getComboMarcasOptions = getComboMarcasOptions;
        this.createComboAnunciante = createComboAnunciante;
        this.updateComboAnunciante = updateComboAnunciante;
        this.deactivateComboAnunciante = deactivateComboAnunciante;
    }
    list = async (_req, res) => {
        const items = await this.getCombosAnunciantes.execute();
        res.status(200).json({ items });
    };
    getById = async (req, res) => {
        const params = combos_anunciantes_schemas_1.comboAnuncianteIdParamsSchema.parse(req.params);
        const item = await this.getComboAnuncianteById.execute(params.id);
        res.status(200).json({ item });
    };
    listMarcasOptions = async (_req, res) => {
        const items = await this.getComboMarcasOptions.execute();
        res.status(200).json({ items });
    };
    create = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const data = combos_anunciantes_schemas_1.createComboAnuncianteSchema.parse(req.body);
        const item = await this.createComboAnunciante.execute({
            comboAnunciante: data.comboAnunciante,
            marcas: data.marcas,
            creadoPor: idUsuario,
        });
        res.status(201).json({ item });
    };
    update = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = combos_anunciantes_schemas_1.comboAnuncianteIdParamsSchema.parse(req.params);
        const data = combos_anunciantes_schemas_1.updateComboAnuncianteSchema.parse(req.body);
        const item = await this.updateComboAnunciante.execute(params.id, {
            comboAnunciante: data.comboAnunciante,
            marcas: data.marcas,
            activo: data.activo,
            actualizadoPor: idUsuario,
        });
        res.status(200).json({ item });
    };
    remove = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = combos_anunciantes_schemas_1.comboAnuncianteIdParamsSchema.parse(req.params);
        await this.deactivateComboAnunciante.execute(params.id, idUsuario);
        res.status(204).send();
    };
}
exports.CombosAnunciantesController = CombosAnunciantesController;
//# sourceMappingURL=combos-anunciantes.controller.js.map