"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarcasProductosController = void 0;
const get_auth_user_id_1 = require("../../../../shared/presentation/get-auth-user-id");
const marcas_productos_schemas_1 = require("../validators/marcas-productos.schemas");
class MarcasProductosController {
    getMarcasProductos;
    getMarcaProductoById;
    createMarcaProducto;
    updateMarcaProducto;
    deactivateMarcaProducto;
    uploadService;
    importMarcasProductosExcel;
    constructor(getMarcasProductos, getMarcaProductoById, createMarcaProducto, updateMarcaProducto, deactivateMarcaProducto, uploadService, importMarcasProductosExcel) {
        this.getMarcasProductos = getMarcasProductos;
        this.getMarcaProductoById = getMarcaProductoById;
        this.createMarcaProducto = createMarcaProducto;
        this.updateMarcaProducto = updateMarcaProducto;
        this.deactivateMarcaProducto = deactivateMarcaProducto;
        this.uploadService = uploadService;
        this.importMarcasProductosExcel = importMarcasProductosExcel;
    }
    list = async (_req, res) => {
        const items = await this.getMarcasProductos.execute();
        res.status(200).json({ items });
    };
    getById = async (req, res) => {
        const params = marcas_productos_schemas_1.marcaProductoIdParamsSchema.parse(req.params);
        const item = await this.getMarcaProductoById.execute(params.id);
        res.status(200).json({ item });
    };
    create = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const data = marcas_productos_schemas_1.createMarcaProductoSchema.parse(req.body);
        const item = await this.createMarcaProducto.execute({
            idAnunciante: data.idAnunciante,
            idCategoriaAnunciante: data.idCategoriaAnunciante,
            marcaProducto: data.marcaProducto,
            creadoPor: idUsuario,
        });
        res.status(201).json({ item });
    };
    update = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = marcas_productos_schemas_1.marcaProductoIdParamsSchema.parse(req.params);
        const data = marcas_productos_schemas_1.updateMarcaProductoSchema.parse(req.body);
        const item = await this.updateMarcaProducto.execute(params.id, {
            idAnunciante: data.idAnunciante,
            idCategoriaAnunciante: data.idCategoriaAnunciante,
            marcaProducto: data.marcaProducto,
            activo: data.activo,
            actualizadoPor: idUsuario,
        });
        res.status(200).json({ item });
    };
    remove = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = marcas_productos_schemas_1.marcaProductoIdParamsSchema.parse(req.params);
        await this.deactivateMarcaProducto.execute(params.id, idUsuario);
        res.status(204).send();
    };
    importExcel = async (req, res) => {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'Archivo requerido' });
            return;
        }
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const uploaded = await this.uploadService.uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);
        const importResult = await this.importMarcasProductosExcel.execute(req.file.buffer, req.file.originalname, idUsuario);
        res.status(201).json({
            success: true,
            message: importResult.importedCount > 0
                ? `Se importaron ${importResult.importedCount} marcas correctamente`
                : 'No se importaron marcas nuevas',
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
exports.MarcasProductosController = MarcasProductosController;
//# sourceMappingURL=marcas-productos.controller.js.map