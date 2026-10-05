"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectoresIndustrialesController = void 0;
const get_auth_user_id_1 = require("../../../../shared/presentation/get-auth-user-id");
const sectores_industriales_schemas_1 = require("../validators/sectores-industriales.schemas");
class SectoresIndustrialesController {
    getSectoresIndustriales;
    getSectorIndustrialById;
    createSectorIndustrial;
    updateSectorIndustrial;
    deactivateSectorIndustrial;
    uploadService;
    importSectoresIndustrialesExcel;
    constructor(getSectoresIndustriales, getSectorIndustrialById, createSectorIndustrial, updateSectorIndustrial, deactivateSectorIndustrial, uploadService, importSectoresIndustrialesExcel) {
        this.getSectoresIndustriales = getSectoresIndustriales;
        this.getSectorIndustrialById = getSectorIndustrialById;
        this.createSectorIndustrial = createSectorIndustrial;
        this.updateSectorIndustrial = updateSectorIndustrial;
        this.deactivateSectorIndustrial = deactivateSectorIndustrial;
        this.uploadService = uploadService;
        this.importSectoresIndustrialesExcel = importSectoresIndustrialesExcel;
    }
    list = async (_req, res) => {
        const items = await this.getSectoresIndustriales.execute();
        res.status(200).json({ items });
    };
    getById = async (req, res) => {
        const params = sectores_industriales_schemas_1.sectorIndustrialIdParamsSchema.parse(req.params);
        const item = await this.getSectorIndustrialById.execute(params.id);
        res.status(200).json({ item });
    };
    create = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const data = sectores_industriales_schemas_1.createSectorIndustrialSchema.parse(req.body);
        const item = await this.createSectorIndustrial.execute({
            sectorIndustrial: data.sectorIndustrial,
            creadoPor: idUsuario,
        });
        res.status(201).json({ item });
    };
    update = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = sectores_industriales_schemas_1.sectorIndustrialIdParamsSchema.parse(req.params);
        const data = sectores_industriales_schemas_1.updateSectorIndustrialSchema.parse(req.body);
        const item = await this.updateSectorIndustrial.execute(params.id, {
            sectorIndustrial: data.sectorIndustrial,
            activo: data.activo,
            actualizadoPor: idUsuario,
        });
        res.status(200).json({ item });
    };
    remove = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = sectores_industriales_schemas_1.sectorIndustrialIdParamsSchema.parse(req.params);
        await this.deactivateSectorIndustrial.execute(params.id, idUsuario);
        res.status(204).send();
    };
    importExcel = async (req, res) => {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'Archivo requerido' });
            return;
        }
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const uploaded = await this.uploadService.uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);
        const importResult = await this.importSectoresIndustrialesExcel.execute(req.file.buffer, req.file.originalname, idUsuario);
        res.status(201).json({
            success: true,
            message: importResult.importedCount > 0
                ? `Se importaron ${importResult.importedCount} sectores industriales correctamente`
                : 'No se importaron sectores industriales nuevos',
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
exports.SectoresIndustrialesController = SectoresIndustrialesController;
//# sourceMappingURL=sectores-industriales.controller.js.map