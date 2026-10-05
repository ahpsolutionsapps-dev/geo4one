"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportsController = exports.adminController = exports.filesController = exports.AdminController = exports.FilesController = exports.ReportsController = void 0;
const env_1 = require("../../config/env");
const container_1 = require("../../config/container");
const validators_1 = require("../../application/validators");
const helpers_1 = require("../../shared/helpers");
const result_1 = require("../../shared/types/result");
const error_middleware_1 = require("../middlewares/error.middleware");
function mapFileMetadata(file) {
    return {
        id: file.id,
        fileName: file.fileName,
        originalFileName: file.originalFileName,
        extension: file.extension,
        mimeType: file.mimeType,
        fileSize: file.fileSize,
        hash: file.hash,
        downloadUrl: `${env_1.env.publicUrl}/api/files/download/${file.id}`,
        createdAt: file.createdAt.toISOString(),
        updatedAt: file.updatedAt?.toISOString() ?? null,
        deletedAt: file.deletedAt?.toISOString() ?? null,
    };
}
class ReportsController {
    generatePdf = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        const body = validators_1.generateReportPdfSchema.parse(req.body);
        const result = await container_1.container.useCases.generateReportPdf.execute({
            title: body.title,
            headers: body.headers,
            rows: body.rows,
            fileName: body.fileName,
            apiKeyId: req.apiKey?.id,
            ipAddress: req.ip,
        });
        if ((0, result_1.isFail)(result)) {
            throw result.error;
        }
        res.status(201).json({
            success: true,
            message: 'Reporte PDF generado correctamente',
            data: {
                ...result.value,
                downloadUrl: `${env_1.env.publicUrl}${result.value.url}`,
            },
        });
    });
}
exports.ReportsController = ReportsController;
class FilesController {
    upload = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        if (!req.file) {
            res.status(422).json({ success: false, message: 'Archivo requerido en campo "file"' });
            return;
        }
        const result = await container_1.container.useCases.uploadFile.execute({
            buffer: req.file.buffer,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            apiKeyId: req.apiKey?.id,
            ipAddress: req.ip,
        });
        if ((0, result_1.isFail)(result)) {
            throw result.error;
        }
        res.status(201).json({
            success: true,
            message: 'Archivo cargado correctamente',
            data: {
                ...result.value,
                url: `${env_1.env.publicUrl}${result.value.url}`,
            },
        });
    });
    list = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        const query = validators_1.listFilesQuerySchema.parse(req.query);
        const pagination = (0, helpers_1.normalizePagination)(query.page, query.limit);
        const result = await container_1.container.useCases.getFiles.execute({
            fileName: query.fileName,
            mimeType: query.mimeType,
            dateFrom: query.dateFrom,
            dateTo: query.dateTo,
            category: query.category,
            tag: query.tag,
        }, pagination);
        res.json({
            success: true,
            message: 'Listado obtenido correctamente',
            data: {
                ...result,
                items: result.items.map(mapFileMetadata),
            },
        });
    });
    getById = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        const { id } = validators_1.fileIdParamSchema.parse(req.params);
        const file = await container_1.container.useCases.getFileById.execute(id);
        res.json({
            success: true,
            message: 'Metadata obtenida correctamente',
            data: mapFileMetadata(file),
        });
    });
    download = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        const { id } = validators_1.fileIdParamSchema.parse(req.params);
        const { file, buffer } = await container_1.container.useCases.downloadFile.execute({
            id,
            apiKeyId: req.apiKey?.id,
            ipAddress: req.ip,
        });
        res.setHeader('Content-Type', file.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.originalFileName)}"`);
        res.setHeader('Content-Length', buffer.length);
        res.send(buffer);
    });
    remove = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        const { id } = validators_1.fileIdParamSchema.parse(req.params);
        await container_1.container.useCases.deleteFile.execute({
            id,
            apiKeyId: req.apiKey?.id,
            ipAddress: req.ip,
        });
        res.json({ success: true, message: 'Archivo eliminado correctamente' });
    });
    restore = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        const { id } = validators_1.fileIdParamSchema.parse(req.params);
        await container_1.container.useCases.restoreFile.execute({
            id,
            apiKeyId: req.apiKey?.id,
            ipAddress: req.ip,
        });
        res.json({ success: true, message: 'Archivo restaurado correctamente' });
    });
    assignCategories = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        const { id } = validators_1.fileIdParamSchema.parse(req.params);
        const body = validators_1.assignCategoriesSchema.parse(req.body);
        await container_1.container.useCases.assignCategories.execute({
            fileId: id,
            categories: body.categories,
            apiKeyId: req.apiKey?.id,
            ipAddress: req.ip,
        });
        res.json({ success: true, message: 'Categorías asignadas correctamente' });
    });
    assignTags = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        const { id } = validators_1.fileIdParamSchema.parse(req.params);
        const body = validators_1.assignTagsSchema.parse(req.body);
        await container_1.container.useCases.assignTags.execute({
            fileId: id,
            tags: body.tags,
            apiKeyId: req.apiKey?.id,
            ipAddress: req.ip,
        });
        res.json({ success: true, message: 'Etiquetas asignadas correctamente' });
    });
    createVersion = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        const { id } = validators_1.fileIdParamSchema.parse(req.params);
        if (!req.file) {
            res.status(422).json({ success: false, message: 'Archivo requerido en campo "file"' });
            return;
        }
        const version = await container_1.container.useCases.createFileVersion.execute({
            fileId: id,
            buffer: req.file.buffer,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            apiKeyId: req.apiKey?.id,
            ipAddress: req.ip,
        });
        res.status(201).json({
            success: true,
            message: 'Versión creada correctamente',
            data: {
                id: version.id,
                fileId: version.fileId,
                versionNumber: version.versionNumber,
                fileSize: version.fileSize,
                createdAt: version.createdAt.toISOString(),
            },
        });
    });
    listVersions = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        const { id } = validators_1.fileIdParamSchema.parse(req.params);
        const versions = await container_1.container.useCases.getFileVersions.execute(id);
        res.json({
            success: true,
            message: 'Versiones obtenidas correctamente',
            data: versions.map((v) => ({
                id: v.id,
                fileId: v.fileId,
                versionNumber: v.versionNumber,
                fileSize: v.fileSize,
                createdAt: v.createdAt.toISOString(),
            })),
        });
    });
    createSignedUrl = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        const { id } = validators_1.fileIdParamSchema.parse(req.params);
        const signed = await container_1.container.useCases.createSignedUrl.execute(id);
        res.json({
            success: true,
            message: 'URL firmada generada correctamente',
            data: {
                url: signed.url,
                expiresAt: signed.expiresAt.toISOString(),
            },
        });
    });
    downloadSigned = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        const { token } = req.params;
        const { file, buffer } = await container_1.container.useCases.downloadBySignedUrl.execute(token);
        res.setHeader('Content-Type', file.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.originalFileName)}"`);
        res.send(buffer);
    });
    metrics = (0, error_middleware_1.asyncHandler)(async (_req, res) => {
        const metrics = await container_1.container.useCases.getMetrics.execute();
        res.json({ success: true, message: 'Métricas obtenidas', data: metrics });
    });
}
exports.FilesController = FilesController;
class AdminController {
    createApiKey = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        const body = validators_1.createApiKeySchema.parse(req.body);
        const apiKey = await container_1.container.useCases.createApiKey.execute(body.name);
        res.status(201).json({
            success: true,
            message: 'API Key creada correctamente',
            data: {
                id: apiKey.id,
                name: apiKey.name,
                apiKey: apiKey.apiKey,
                isActive: apiKey.isActive,
                createdAt: apiKey.createdAt.toISOString(),
                lastUsedAt: apiKey.lastUsedAt?.toISOString() ?? null,
            },
        });
    });
    listApiKeys = (0, error_middleware_1.asyncHandler)(async (_req, res) => {
        const keys = await container_1.container.useCases.listApiKeys.execute();
        res.json({
            success: true,
            message: 'API Keys obtenidas correctamente',
            data: keys.map((k) => ({
                id: k.id,
                name: k.name,
                isActive: k.isActive,
                createdAt: k.createdAt.toISOString(),
                lastUsedAt: k.lastUsedAt?.toISOString() ?? null,
            })),
        });
    });
    updateApiKey = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        const { id } = validators_1.fileIdParamSchema.parse(req.params);
        const body = validators_1.updateApiKeySchema.parse(req.body);
        const updated = await container_1.container.useCases.updateApiKeyStatus.execute(id, body.isActive);
        res.json({
            success: true,
            message: 'API Key actualizada correctamente',
            data: {
                id: updated.id,
                name: updated.name,
                isActive: updated.isActive,
                createdAt: updated.createdAt.toISOString(),
                lastUsedAt: updated.lastUsedAt?.toISOString() ?? null,
            },
        });
    });
    deleteApiKey = (0, error_middleware_1.asyncHandler)(async (req, res) => {
        const { id } = validators_1.fileIdParamSchema.parse(req.params);
        await container_1.container.useCases.deleteApiKey.execute(id);
        res.json({ success: true, message: 'API Key eliminada correctamente' });
    });
}
exports.AdminController = AdminController;
exports.filesController = new FilesController();
exports.adminController = new AdminController();
exports.reportsController = new ReportsController();
//# sourceMappingURL=index.js.map