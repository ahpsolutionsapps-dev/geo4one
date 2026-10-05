"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvinciasController = void 0;
const get_auth_user_id_1 = require("../../../../shared/presentation/get-auth-user-id");
const provincias_schemas_1 = require("../validators/provincias.schemas");
class ProvinciasController {
    getProvincias;
    getProvinciaById;
    createProvincia;
    updateProvincia;
    deactivateProvincia;
    uploadService;
    importProvinciasExcel;
    constructor(getProvincias, getProvinciaById, createProvincia, updateProvincia, deactivateProvincia, uploadService, importProvinciasExcel) {
        this.getProvincias = getProvincias;
        this.getProvinciaById = getProvinciaById;
        this.createProvincia = createProvincia;
        this.updateProvincia = updateProvincia;
        this.deactivateProvincia = deactivateProvincia;
        this.uploadService = uploadService;
        this.importProvinciasExcel = importProvinciasExcel;
    }
    list = async (_req, res) => {
        const items = await this.getProvincias.execute();
        res.status(200).json({ items });
    };
    getById = async (req, res) => {
        const params = provincias_schemas_1.provinciaIdParamsSchema.parse(req.params);
        const item = await this.getProvinciaById.execute(params.id);
        res.status(200).json({ item });
    };
    create = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const data = provincias_schemas_1.createProvinciaSchema.parse(req.body);
        const item = await this.createProvincia.execute({
            provincia: data.provincia,
            latitud: data.latitud ?? null,
            longitud: data.longitud ?? null,
            creadoPor: idUsuario,
        });
        res.status(201).json({ item });
    };
    update = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = provincias_schemas_1.provinciaIdParamsSchema.parse(req.params);
        const data = provincias_schemas_1.updateProvinciaSchema.parse(req.body);
        const item = await this.updateProvincia.execute(params.id, {
            provincia: data.provincia,
            latitud: data.latitud ?? undefined,
            longitud: data.longitud ?? undefined,
            activo: data.activo,
            actualizadoPor: idUsuario,
        });
        res.status(200).json({ item });
    };
    remove = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = provincias_schemas_1.provinciaIdParamsSchema.parse(req.params);
        await this.deactivateProvincia.execute(params.id, idUsuario);
        res.status(204).send();
    };
    importExcel = async (req, res) => {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'Archivo requerido' });
            return;
        }
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const uploaded = await this.uploadService.uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);
        const importResult = await this.importProvinciasExcel.execute(req.file.buffer, req.file.originalname, idUsuario);
        res.status(201).json({
            success: true,
            message: importResult.importedCount > 0
                ? `Se importaron ${importResult.importedCount} provincias correctamente`
                : 'No se importaron provincias nuevas',
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
exports.ProvinciasController = ProvinciasController;
//# sourceMappingURL=provincias.controller.js.map