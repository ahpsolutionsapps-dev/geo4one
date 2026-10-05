"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectoresController = void 0;
const get_auth_user_id_1 = require("../../../../shared/presentation/get-auth-user-id");
const sectores_schemas_1 = require("../validators/sectores.schemas");
class SectoresController {
    getSectores;
    getSectorById;
    createSector;
    updateSector;
    deactivateSector;
    uploadService;
    importSectoresExcel;
    constructor(getSectores, getSectorById, createSector, updateSector, deactivateSector, uploadService, importSectoresExcel) {
        this.getSectores = getSectores;
        this.getSectorById = getSectorById;
        this.createSector = createSector;
        this.updateSector = updateSector;
        this.deactivateSector = deactivateSector;
        this.uploadService = uploadService;
        this.importSectoresExcel = importSectoresExcel;
    }
    list = async (_req, res) => {
        const items = await this.getSectores.execute();
        res.status(200).json({ items });
    };
    getById = async (req, res) => {
        const params = sectores_schemas_1.sectorIdParamsSchema.parse(req.params);
        const item = await this.getSectorById.execute(params.id);
        res.status(200).json({ item });
    };
    create = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const data = sectores_schemas_1.createSectorSchema.parse(req.body);
        const item = await this.createSector.execute({
            idMunicipio: data.idMunicipio,
            sectorBarrio: data.sectorBarrio,
            circunscripcion: data.circunscripcion ?? null,
            latitud: data.latitud ?? null,
            longitud: data.longitud ?? null,
            creadoPor: idUsuario,
        });
        res.status(201).json({ item });
    };
    update = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = sectores_schemas_1.sectorIdParamsSchema.parse(req.params);
        const data = sectores_schemas_1.updateSectorSchema.parse(req.body);
        const item = await this.updateSector.execute(params.id, {
            idMunicipio: data.idMunicipio,
            sectorBarrio: data.sectorBarrio,
            circunscripcion: data.circunscripcion,
            latitud: data.latitud ?? undefined,
            longitud: data.longitud ?? undefined,
            activo: data.activo,
            actualizadoPor: idUsuario,
        });
        res.status(200).json({ item });
    };
    remove = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = sectores_schemas_1.sectorIdParamsSchema.parse(req.params);
        await this.deactivateSector.execute(params.id, idUsuario);
        res.status(204).send();
    };
    importExcel = async (req, res) => {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'Archivo requerido' });
            return;
        }
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const uploaded = await this.uploadService.uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);
        const importResult = await this.importSectoresExcel.execute(req.file.buffer, req.file.originalname, idUsuario);
        res.status(201).json({
            success: true,
            message: importResult.importedCount > 0
                ? `Se importaron ${importResult.importedCount} sectores correctamente`
                : 'No se importaron sectores nuevos',
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
exports.SectoresController = SectoresController;
//# sourceMappingURL=sectores.controller.js.map