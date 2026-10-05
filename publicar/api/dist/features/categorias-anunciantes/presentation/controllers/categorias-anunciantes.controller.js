"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriasAnunciantesController = void 0;
const get_auth_user_id_1 = require("../../../../shared/presentation/get-auth-user-id");
const categorias_anunciantes_schemas_1 = require("../validators/categorias-anunciantes.schemas");
class CategoriasAnunciantesController {
    getCategoriasAnunciantes;
    getCategoriaAnuncianteById;
    createCategoriaAnunciante;
    updateCategoriaAnunciante;
    deactivateCategoriaAnunciante;
    uploadService;
    importCategoriasAnunciantesExcel;
    constructor(getCategoriasAnunciantes, getCategoriaAnuncianteById, createCategoriaAnunciante, updateCategoriaAnunciante, deactivateCategoriaAnunciante, uploadService, importCategoriasAnunciantesExcel) {
        this.getCategoriasAnunciantes = getCategoriasAnunciantes;
        this.getCategoriaAnuncianteById = getCategoriaAnuncianteById;
        this.createCategoriaAnunciante = createCategoriaAnunciante;
        this.updateCategoriaAnunciante = updateCategoriaAnunciante;
        this.deactivateCategoriaAnunciante = deactivateCategoriaAnunciante;
        this.uploadService = uploadService;
        this.importCategoriasAnunciantesExcel = importCategoriasAnunciantesExcel;
    }
    list = async (_req, res) => {
        const items = await this.getCategoriasAnunciantes.execute();
        res.status(200).json({ items });
    };
    getById = async (req, res) => {
        const params = categorias_anunciantes_schemas_1.categoriaAnuncianteIdParamsSchema.parse(req.params);
        const item = await this.getCategoriaAnuncianteById.execute(params.id);
        res.status(200).json({ item });
    };
    create = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const data = categorias_anunciantes_schemas_1.createCategoriaAnuncianteSchema.parse(req.body);
        const item = await this.createCategoriaAnunciante.execute({
            idSectorIndustrial: data.idSectorIndustrial,
            idSubSectorIndustrial: data.idSubSectorIndustrial,
            categoriaAnunciante: data.categoriaAnunciante,
            creadoPor: idUsuario,
        });
        res.status(201).json({ item });
    };
    update = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = categorias_anunciantes_schemas_1.categoriaAnuncianteIdParamsSchema.parse(req.params);
        const data = categorias_anunciantes_schemas_1.updateCategoriaAnuncianteSchema.parse(req.body);
        const item = await this.updateCategoriaAnunciante.execute(params.id, {
            idSectorIndustrial: data.idSectorIndustrial,
            idSubSectorIndustrial: data.idSubSectorIndustrial,
            categoriaAnunciante: data.categoriaAnunciante,
            activo: data.activo,
            actualizadoPor: idUsuario,
        });
        res.status(200).json({ item });
    };
    remove = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = categorias_anunciantes_schemas_1.categoriaAnuncianteIdParamsSchema.parse(req.params);
        await this.deactivateCategoriaAnunciante.execute(params.id, idUsuario);
        res.status(204).send();
    };
    importExcel = async (req, res) => {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'Archivo requerido' });
            return;
        }
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const uploaded = await this.uploadService.uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);
        const importResult = await this.importCategoriasAnunciantesExcel.execute(req.file.buffer, req.file.originalname, idUsuario);
        res.status(201).json({
            success: true,
            message: importResult.importedCount > 0
                ? `Se importaron ${importResult.importedCount} categorías correctamente`
                : 'No se importaron categorías nuevas',
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
exports.CategoriasAnunciantesController = CategoriasAnunciantesController;
//# sourceMappingURL=categorias-anunciantes.controller.js.map