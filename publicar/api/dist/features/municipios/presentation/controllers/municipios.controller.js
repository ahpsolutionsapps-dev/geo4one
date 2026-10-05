"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MunicipiosController = void 0;
const get_auth_user_id_1 = require("../../../../shared/presentation/get-auth-user-id");
const municipios_schemas_1 = require("../validators/municipios.schemas");
class MunicipiosController {
    getMunicipios;
    getMunicipioById;
    createMunicipio;
    updateMunicipio;
    deactivateMunicipio;
    uploadService;
    importMunicipiosExcel;
    constructor(getMunicipios, getMunicipioById, createMunicipio, updateMunicipio, deactivateMunicipio, uploadService, importMunicipiosExcel) {
        this.getMunicipios = getMunicipios;
        this.getMunicipioById = getMunicipioById;
        this.createMunicipio = createMunicipio;
        this.updateMunicipio = updateMunicipio;
        this.deactivateMunicipio = deactivateMunicipio;
        this.uploadService = uploadService;
        this.importMunicipiosExcel = importMunicipiosExcel;
    }
    list = async (_req, res) => {
        const items = await this.getMunicipios.execute();
        res.status(200).json({ items });
    };
    getById = async (req, res) => {
        const params = municipios_schemas_1.municipioIdParamsSchema.parse(req.params);
        const item = await this.getMunicipioById.execute(params.id);
        res.status(200).json({ item });
    };
    create = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const data = municipios_schemas_1.createMunicipioSchema.parse(req.body);
        const item = await this.createMunicipio.execute({
            idProvincia: data.idProvincia,
            municipio: data.municipio,
            latitud: data.latitud ?? null,
            longitud: data.longitud ?? null,
            creadoPor: idUsuario,
        });
        res.status(201).json({ item });
    };
    update = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = municipios_schemas_1.municipioIdParamsSchema.parse(req.params);
        const data = municipios_schemas_1.updateMunicipioSchema.parse(req.body);
        const item = await this.updateMunicipio.execute(params.id, {
            idProvincia: data.idProvincia,
            municipio: data.municipio,
            latitud: data.latitud ?? undefined,
            longitud: data.longitud ?? undefined,
            activo: data.activo,
            actualizadoPor: idUsuario,
        });
        res.status(200).json({ item });
    };
    remove = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = municipios_schemas_1.municipioIdParamsSchema.parse(req.params);
        await this.deactivateMunicipio.execute(params.id, idUsuario);
        res.status(204).send();
    };
    importExcel = async (req, res) => {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'Archivo requerido' });
            return;
        }
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const uploaded = await this.uploadService.uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);
        const importResult = await this.importMunicipiosExcel.execute(req.file.buffer, req.file.originalname, idUsuario);
        res.status(201).json({
            success: true,
            message: importResult.importedCount > 0
                ? `Se importaron ${importResult.importedCount} municipios correctamente`
                : 'No se importaron municipios nuevos',
            data: {
                id: uploaded.id,
                fileName: uploaded.fileName,
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                fileSize: req.file.size,
                hash: '',
                url: uploaded.url,
                importedCount: importResult.importedCount,
                skippedCount: importResult.skippedCount,
                duplicates: importResult.duplicates,
            },
        });
    };
}
exports.MunicipiosController = MunicipiosController;
//# sourceMappingURL=municipios.controller.js.map