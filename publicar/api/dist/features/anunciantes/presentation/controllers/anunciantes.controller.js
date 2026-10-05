"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnunciantesController = void 0;
const get_auth_user_id_1 = require("../../../../shared/presentation/get-auth-user-id");
const anunciantes_schemas_1 = require("../validators/anunciantes.schemas");
class AnunciantesController {
    getAnunciantes;
    getAnuncianteById;
    getSectoresOptions;
    getSubSectoresOptions;
    getCategoriasOptions;
    createAnunciante;
    updateAnunciante;
    deactivateAnunciante;
    uploadService;
    importAnunciantesExcel;
    constructor(getAnunciantes, getAnuncianteById, getSectoresOptions, getSubSectoresOptions, getCategoriasOptions, createAnunciante, updateAnunciante, deactivateAnunciante, uploadService, importAnunciantesExcel) {
        this.getAnunciantes = getAnunciantes;
        this.getAnuncianteById = getAnuncianteById;
        this.getSectoresOptions = getSectoresOptions;
        this.getSubSectoresOptions = getSubSectoresOptions;
        this.getCategoriasOptions = getCategoriasOptions;
        this.createAnunciante = createAnunciante;
        this.updateAnunciante = updateAnunciante;
        this.deactivateAnunciante = deactivateAnunciante;
        this.uploadService = uploadService;
        this.importAnunciantesExcel = importAnunciantesExcel;
    }
    list = async (_req, res) => {
        const items = await this.getAnunciantes.execute();
        res.status(200).json({ items });
    };
    getById = async (req, res) => {
        const params = anunciantes_schemas_1.anuncianteIdParamsSchema.parse(req.params);
        const item = await this.getAnuncianteById.execute(params.id);
        res.status(200).json({ item });
    };
    listSectoresOptions = async (_req, res) => {
        const items = await this.getSectoresOptions.execute();
        res.status(200).json({ items });
    };
    listSubSectoresOptions = async (req, res) => {
        const query = anunciantes_schemas_1.subSectoresOptionsQuerySchema.parse(req.query);
        const items = await this.getSubSectoresOptions.execute(query.idSectorIndustrial);
        res.status(200).json({ items });
    };
    listCategoriasOptions = async (req, res) => {
        const query = anunciantes_schemas_1.categoriasOptionsQuerySchema.parse(req.query);
        const items = await this.getCategoriasOptions.execute(query.idSubSectorIndustrial);
        res.status(200).json({ items });
    };
    create = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const data = anunciantes_schemas_1.createAnuncianteSchema.parse(req.body);
        const item = await this.createAnunciante.execute({
            idSectorIndustrial: data.idSectorIndustrial,
            idSubSectorIndustrial: data.idSubSectorIndustrial,
            idCategoriaAnunciante: data.idCategoriaAnunciante,
            anunciante: data.anunciante,
            creadoPor: idUsuario,
        });
        res.status(201).json({ item });
    };
    update = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = anunciantes_schemas_1.anuncianteIdParamsSchema.parse(req.params);
        const data = anunciantes_schemas_1.updateAnuncianteSchema.parse(req.body);
        const item = await this.updateAnunciante.execute(params.id, {
            idSectorIndustrial: data.idSectorIndustrial,
            idSubSectorIndustrial: data.idSubSectorIndustrial,
            idCategoriaAnunciante: data.idCategoriaAnunciante,
            anunciante: data.anunciante,
            activo: data.activo,
            actualizadoPor: idUsuario,
        });
        res.status(200).json({ item });
    };
    remove = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = anunciantes_schemas_1.anuncianteIdParamsSchema.parse(req.params);
        await this.deactivateAnunciante.execute(params.id, idUsuario);
        res.status(204).send();
    };
    importExcel = async (req, res) => {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'Archivo requerido' });
            return;
        }
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const uploaded = await this.uploadService.uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);
        const importResult = await this.importAnunciantesExcel.execute(req.file.buffer, req.file.originalname, idUsuario);
        res.status(201).json({
            success: true,
            message: importResult.importedCount > 0
                ? `Se importaron ${importResult.importedCount} anunciantes correctamente`
                : 'No se importaron anunciantes nuevos',
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
exports.AnunciantesController = AnunciantesController;
//# sourceMappingURL=anunciantes.controller.js.map