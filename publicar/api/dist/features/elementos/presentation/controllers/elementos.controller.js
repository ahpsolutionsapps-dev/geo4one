"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementosController = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const app_error_1 = require("../../../../core/errors/app-error");
const get_auth_user_id_1 = require("../../../../shared/presentation/get-auth-user-id");
const schemas_1 = require("../../../../shared/presentation/schemas");
const catalogIdParamSchema = zod_1.z.object({
    id: (0, schemas_1.positiveIntIdParam)('Id invalido'),
});
const createSimpleCatalogSchema = zod_1.z.object({
    nombre: zod_1.z.string().trim().min(2).max(150),
});
const updateSimpleCatalogSchema = zod_1.z
    .object({
    nombre: zod_1.z.string().trim().min(2).max(150).optional(),
    activo: zod_1.z.coerce.boolean().optional(),
})
    .refine((value) => value.nombre !== undefined || value.activo !== undefined, {
    message: 'Debes enviar al menos un campo para actualizar',
});
const createFormatoSchema = zod_1.z.object({
    idTipoElemento: (0, schemas_1.positiveIntIdParam)('Id de tipo de elemento invalido'),
    formato: zod_1.z.string().trim().min(2).max(150),
});
const updateFormatoSchema = zod_1.z
    .object({
    idTipoElemento: (0, schemas_1.positiveIntIdParam)('Id de tipo de elemento invalido').optional(),
    formato: zod_1.z.string().trim().min(2).max(150).optional(),
    activo: zod_1.z.coerce.boolean().optional(),
})
    .refine((value) => value.idTipoElemento !== undefined ||
    value.formato !== undefined ||
    value.activo !== undefined, { message: 'Debes enviar al menos un campo para actualizar' });
class ElementosController {
    getElementos;
    getElementoById;
    createElemento;
    updateElemento;
    anularElemento;
    repository;
    uploadService;
    importCatalogosExcel;
    importElementosExcelService;
    constructor(getElementos, getElementoById, createElemento, updateElemento, anularElemento, repository, uploadService, importCatalogosExcel, importElementosExcelService) {
        this.getElementos = getElementos;
        this.getElementoById = getElementoById;
        this.createElemento = createElemento;
        this.updateElemento = updateElemento;
        this.anularElemento = anularElemento;
        this.repository = repository;
        this.uploadService = uploadService;
        this.importCatalogosExcel = importCatalogosExcel;
        this.importElementosExcelService = importElementosExcelService;
    }
    sendImportResponse(res, req, uploaded, importResult, moduleLabel) {
        res.status(201).json({
            success: true,
            message: importResult.importedCount > 0
                ? `Se importaron ${importResult.importedCount} ${moduleLabel} correctamente`
                : `No se importaron ${moduleLabel} nuevos`,
            data: {
                id: uploaded.id,
                fileName: uploaded.fileName,
                originalName: req.file?.originalname,
                mimeType: req.file?.mimetype,
                fileSize: req.file?.size,
                hash: '',
                url: uploaded.url,
                importedCount: importResult.importedCount,
                skippedCount: importResult.skippedCount,
                duplicates: importResult.duplicates,
            },
        });
    }
    uploadRequiredFile = async (req) => {
        if (!req.file) {
            throw new app_error_1.ValidationError('Archivo requerido');
        }
        return this.uploadService.uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);
    };
    handleCatalogWriteError(error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new app_error_1.ConflictError('Ya existe un registro con esos datos');
            }
            if (error.code === 'P2025') {
                throw new app_error_1.NotFoundError('Registro no encontrado');
            }
        }
        throw error;
    }
    list = async (req, res) => {
        const items = await this.getElementos.execute({
            includeAnulados: req.query.includeAnulados === 'true',
            activo: req.query.activo !== undefined ? req.query.activo === 'true' : undefined,
            termino: typeof req.query.q === 'string' ? req.query.q : undefined,
        });
        res.status(200).json({ items });
    };
    getById = async (req, res) => {
        const idElemento = Number(req.params.id);
        const item = await this.getElementoById.execute(idElemento);
        res.status(200).json({ item });
    };
    create = async (req, res) => {
        const idUsuarioRegistra = (0, get_auth_user_id_1.getAuthUserId)(req);
        const item = await this.createElemento.execute({
            ...req.body,
            idUsuarioRegistra,
        });
        res.status(201).json({ item });
    };
    update = async (req, res) => {
        const idUsuarioModifica = (0, get_auth_user_id_1.getAuthUserId)(req);
        const idElemento = Number(req.params.id);
        const item = await this.updateElemento.execute(idElemento, {
            ...req.body,
            idUsuarioModifica,
        });
        res.status(200).json({ item });
    };
    remove = async (req, res) => {
        const idUsuarioAnula = (0, get_auth_user_id_1.getAuthUserId)(req);
        const idElemento = Number(req.params.id);
        await this.anularElemento.execute(idElemento, idUsuarioAnula);
        res.status(204).send();
    };
    importTiposElementosExcel = async (req, res) => {
        const uploaded = await this.uploadRequiredFile(req);
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const importResult = await this.importCatalogosExcel.importSimple('tipos-elementos', req.file.buffer, req.file.originalname, idUsuario);
        this.sendImportResponse(res, req, uploaded, importResult, 'tipos de elementos');
    };
    importOrientacionesExcel = async (req, res) => {
        const uploaded = await this.uploadRequiredFile(req);
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const importResult = await this.importCatalogosExcel.importSimple('orientaciones', req.file.buffer, req.file.originalname, idUsuario);
        this.sendImportResponse(res, req, uploaded, importResult, 'orientaciones');
    };
    importDimensionesExcel = async (req, res) => {
        const uploaded = await this.uploadRequiredFile(req);
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const importResult = await this.importCatalogosExcel.importSimple('dimensiones', req.file.buffer, req.file.originalname, idUsuario);
        this.sendImportResponse(res, req, uploaded, importResult, 'dimensiones');
    };
    importFormatosExcel = async (req, res) => {
        const uploaded = await this.uploadRequiredFile(req);
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const importResult = await this.importCatalogosExcel.importFormatos(req.file.buffer, req.file.originalname, idUsuario);
        this.sendImportResponse(res, req, uploaded, importResult, 'tipos de formatos');
    };
    importElementosExcel = async (req, res) => {
        const uploaded = await this.uploadRequiredFile(req);
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const importResult = await this.importElementosExcelService.execute(req.file.buffer, req.file.originalname, idUsuario);
        this.sendImportResponse(res, req, uploaded, importResult, 'elementos');
    };
    listTiposElementos = async (_req, res) => {
        const items = await this.repository.findTiposElementosCatalogo();
        res.status(200).json({ items });
    };
    createTipoElemento = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const body = createSimpleCatalogSchema.parse(req.body);
        try {
            const item = await this.repository.createTipoElementoCatalogo({
                nombre: body.nombre,
                creadoPor: idUsuario,
            });
            res.status(201).json({ item });
        }
        catch (error) {
            this.handleCatalogWriteError(error);
        }
    };
    updateTipoElemento = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = catalogIdParamSchema.parse(req.params);
        const body = updateSimpleCatalogSchema.parse(req.body);
        try {
            const item = await this.repository.updateTipoElementoCatalogo(params.id, {
                nombre: body.nombre,
                activo: body.activo,
                actualizadoPor: idUsuario,
            });
            res.status(200).json({ item });
        }
        catch (error) {
            this.handleCatalogWriteError(error);
        }
    };
    removeTipoElemento = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = catalogIdParamSchema.parse(req.params);
        try {
            await this.repository.deactivateTipoElementoCatalogo(params.id, idUsuario);
            res.status(204).send();
        }
        catch (error) {
            this.handleCatalogWriteError(error);
        }
    };
    listOrientaciones = async (_req, res) => {
        const items = await this.repository.findOrientacionesCatalogo();
        res.status(200).json({ items });
    };
    createOrientacion = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const body = createSimpleCatalogSchema.parse(req.body);
        try {
            const item = await this.repository.createOrientacionCatalogo({
                nombre: body.nombre,
                creadoPor: idUsuario,
            });
            res.status(201).json({ item });
        }
        catch (error) {
            this.handleCatalogWriteError(error);
        }
    };
    updateOrientacion = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = catalogIdParamSchema.parse(req.params);
        const body = updateSimpleCatalogSchema.parse(req.body);
        try {
            const item = await this.repository.updateOrientacionCatalogo(params.id, {
                nombre: body.nombre,
                activo: body.activo,
                actualizadoPor: idUsuario,
            });
            res.status(200).json({ item });
        }
        catch (error) {
            this.handleCatalogWriteError(error);
        }
    };
    removeOrientacion = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = catalogIdParamSchema.parse(req.params);
        try {
            await this.repository.deactivateOrientacionCatalogo(params.id, idUsuario);
            res.status(204).send();
        }
        catch (error) {
            this.handleCatalogWriteError(error);
        }
    };
    listDimensiones = async (_req, res) => {
        const items = await this.repository.findDimensionesCatalogo();
        res.status(200).json({ items });
    };
    createDimension = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const body = createSimpleCatalogSchema.parse(req.body);
        try {
            const item = await this.repository.createDimensionCatalogo({
                nombre: body.nombre,
                creadoPor: idUsuario,
            });
            res.status(201).json({ item });
        }
        catch (error) {
            this.handleCatalogWriteError(error);
        }
    };
    updateDimension = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = catalogIdParamSchema.parse(req.params);
        const body = updateSimpleCatalogSchema.parse(req.body);
        try {
            const item = await this.repository.updateDimensionCatalogo(params.id, {
                nombre: body.nombre,
                activo: body.activo,
                actualizadoPor: idUsuario,
            });
            res.status(200).json({ item });
        }
        catch (error) {
            this.handleCatalogWriteError(error);
        }
    };
    removeDimension = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = catalogIdParamSchema.parse(req.params);
        try {
            await this.repository.deactivateDimensionCatalogo(params.id, idUsuario);
            res.status(204).send();
        }
        catch (error) {
            this.handleCatalogWriteError(error);
        }
    };
    listFormatos = async (_req, res) => {
        const items = await this.repository.findFormatosCatalogo();
        res.status(200).json({ items });
    };
    createFormato = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const body = createFormatoSchema.parse(req.body);
        try {
            const item = await this.repository.createFormatoCatalogo({
                idTipoElemento: body.idTipoElemento,
                formato: body.formato,
                creadoPor: idUsuario,
            });
            res.status(201).json({ item });
        }
        catch (error) {
            this.handleCatalogWriteError(error);
        }
    };
    updateFormato = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = catalogIdParamSchema.parse(req.params);
        const body = updateFormatoSchema.parse(req.body);
        try {
            const item = await this.repository.updateFormatoCatalogo(params.id, {
                idTipoElemento: body.idTipoElemento,
                formato: body.formato,
                activo: body.activo,
                actualizadoPor: idUsuario,
            });
            res.status(200).json({ item });
        }
        catch (error) {
            this.handleCatalogWriteError(error);
        }
    };
    removeFormato = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = catalogIdParamSchema.parse(req.params);
        try {
            await this.repository.deactivateFormatoCatalogo(params.id, idUsuario);
            res.status(204).send();
        }
        catch (error) {
            this.handleCatalogWriteError(error);
        }
    };
}
exports.ElementosController = ElementosController;
//# sourceMappingURL=elementos.controller.js.map