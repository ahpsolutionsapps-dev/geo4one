"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubSectoresIndustrialesController = void 0;
const get_auth_user_id_1 = require("../../../../shared/presentation/get-auth-user-id");
const sub_sectores_industriales_schemas_1 = require("../validators/sub-sectores-industriales.schemas");
class SubSectoresIndustrialesController {
    getSubSectoresIndustriales;
    getSubSectorIndustrialById;
    createSubSectorIndustrial;
    updateSubSectorIndustrial;
    deactivateSubSectorIndustrial;
    uploadService;
    importSubSectoresIndustrialesExcel;
    constructor(getSubSectoresIndustriales, getSubSectorIndustrialById, createSubSectorIndustrial, updateSubSectorIndustrial, deactivateSubSectorIndustrial, uploadService, importSubSectoresIndustrialesExcel) {
        this.getSubSectoresIndustriales = getSubSectoresIndustriales;
        this.getSubSectorIndustrialById = getSubSectorIndustrialById;
        this.createSubSectorIndustrial = createSubSectorIndustrial;
        this.updateSubSectorIndustrial = updateSubSectorIndustrial;
        this.deactivateSubSectorIndustrial = deactivateSubSectorIndustrial;
        this.uploadService = uploadService;
        this.importSubSectoresIndustrialesExcel = importSubSectoresIndustrialesExcel;
    }
    list = async (_req, res) => {
        const items = await this.getSubSectoresIndustriales.execute();
        res.status(200).json({ items });
    };
    getById = async (req, res) => {
        const params = sub_sectores_industriales_schemas_1.subSectorIndustrialIdParamsSchema.parse(req.params);
        const item = await this.getSubSectorIndustrialById.execute(params.id);
        res.status(200).json({ item });
    };
    create = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const data = sub_sectores_industriales_schemas_1.createSubSectorIndustrialSchema.parse(req.body);
        const item = await this.createSubSectorIndustrial.execute({
            idSectorIndustrial: data.idSectorIndustrial,
            subSectorIndustrial: data.subSectorIndustrial,
            creadoPor: idUsuario,
        });
        res.status(201).json({ item });
    };
    update = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = sub_sectores_industriales_schemas_1.subSectorIndustrialIdParamsSchema.parse(req.params);
        const data = sub_sectores_industriales_schemas_1.updateSubSectorIndustrialSchema.parse(req.body);
        const item = await this.updateSubSectorIndustrial.execute(params.id, {
            idSectorIndustrial: data.idSectorIndustrial,
            subSectorIndustrial: data.subSectorIndustrial,
            activo: data.activo,
            actualizadoPor: idUsuario,
        });
        res.status(200).json({ item });
    };
    remove = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = sub_sectores_industriales_schemas_1.subSectorIndustrialIdParamsSchema.parse(req.params);
        await this.deactivateSubSectorIndustrial.execute(params.id, idUsuario);
        res.status(204).send();
    };
    importExcel = async (req, res) => {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'Archivo requerido' });
            return;
        }
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const uploaded = await this.uploadService.uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);
        const importResult = await this.importSubSectoresIndustrialesExcel.execute(req.file.buffer, req.file.originalname, idUsuario);
        res.status(201).json({
            success: true,
            message: importResult.importedCount > 0
                ? `Se importaron ${importResult.importedCount} sub sectores industriales correctamente`
                : 'No se importaron sub sectores industriales nuevos',
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
exports.SubSectoresIndustrialesController = SubSectoresIndustrialesController;
//# sourceMappingURL=sub-sectores-industriales.controller.js.map