"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateReportPdfUseCase = exports.GetMetricsUseCase = exports.DeleteApiKeyUseCase = exports.UpdateApiKeyStatusUseCase = exports.ListApiKeysUseCase = exports.CreateApiKeyUseCase = exports.DownloadBySignedUrlUseCase = exports.CreateSignedUrlUseCase = exports.GetFileVersionsUseCase = exports.CreateFileVersionUseCase = exports.AssignTagsUseCase = exports.AssignCategoriesUseCase = exports.RestoreFileUseCase = exports.DeleteFileUseCase = exports.DownloadFileUseCase = exports.GetFileByIdUseCase = exports.GetFilesUseCase = exports.UploadFileUseCase = void 0;
const uuid_1 = require("uuid");
const env_1 = require("../../config/env");
const file_validator_service_1 = require("../../domain/services/file-validator.service");
const constants_1 = require("../../shared/constants");
const app_error_1 = require("../../shared/errors/app-error");
const helpers_1 = require("../../shared/helpers");
const result_1 = require("../../shared/types/result");
const pdf_report_generator_1 = require("../../infrastructure/pdf/pdf-report.generator");
class UploadFileUseCase {
    fileRepository;
    auditLogRepository;
    storageService;
    constructor(fileRepository, auditLogRepository, storageService) {
        this.fileRepository = fileRepository;
        this.auditLogRepository = auditLogRepository;
        this.storageService = storageService;
    }
    async execute(input) {
        const { sanitizedName, extension } = file_validator_service_1.FileValidator.validateUpload(input.originalName, input.mimeType, input.buffer.length);
        const hash = file_validator_service_1.FileValidator.computeHash(input.buffer);
        if (env_1.env.enableDuplicateDetection) {
            const duplicate = await this.fileRepository.findByHash(hash);
            if (duplicate) {
                return (0, result_1.ok)({
                    id: duplicate.id,
                    fileName: duplicate.fileName,
                    url: `/api/files/download/${duplicate.id}`,
                });
            }
        }
        const id = (0, uuid_1.v4)();
        const fileName = `${id}.${extension}`;
        const datePath = (0, helpers_1.buildDateStoragePath)();
        const storagePath = `${datePath}/${fileName}`;
        await this.storageService.save(input.buffer, storagePath);
        await this.fileRepository.create({
            id,
            fileName,
            originalFileName: sanitizedName,
            extension,
            mimeType: input.mimeType,
            fileSize: input.buffer.length,
            storagePath,
            hash,
        });
        await this.auditLogRepository.create({
            id: (0, uuid_1.v4)(),
            apiKeyId: input.apiKeyId ?? null,
            action: constants_1.AUDIT_ACTIONS.UPLOAD,
            fileId: id,
            details: sanitizedName,
            ipAddress: input.ipAddress ?? null,
        });
        return (0, result_1.ok)({
            id,
            fileName,
            url: `/api/files/download/${id}`,
        });
    }
}
exports.UploadFileUseCase = UploadFileUseCase;
class GetFilesUseCase {
    fileRepository;
    constructor(fileRepository) {
        this.fileRepository = fileRepository;
    }
    execute(filters, pagination) {
        return this.fileRepository.list(filters, pagination);
    }
}
exports.GetFilesUseCase = GetFilesUseCase;
class GetFileByIdUseCase {
    fileRepository;
    constructor(fileRepository) {
        this.fileRepository = fileRepository;
    }
    async execute(id, includeDeleted = false) {
        const file = await this.fileRepository.findById(id, includeDeleted);
        if (!file)
            throw new app_error_1.NotFoundError('Archivo no encontrado');
        return file;
    }
}
exports.GetFileByIdUseCase = GetFileByIdUseCase;
class DownloadFileUseCase {
    fileRepository;
    auditLogRepository;
    storageService;
    constructor(fileRepository, auditLogRepository, storageService) {
        this.fileRepository = fileRepository;
        this.auditLogRepository = auditLogRepository;
        this.storageService = storageService;
    }
    async execute(input) {
        const file = await this.fileRepository.findById(input.id);
        if (!file)
            throw new app_error_1.NotFoundError('Archivo no encontrado');
        const exists = await this.storageService.exists(file.storagePath);
        if (!exists)
            throw new app_error_1.NotFoundError('Archivo físico no encontrado');
        const buffer = await this.storageService.read(file.storagePath);
        await this.auditLogRepository.create({
            id: (0, uuid_1.v4)(),
            apiKeyId: input.apiKeyId ?? null,
            action: constants_1.AUDIT_ACTIONS.DOWNLOAD,
            fileId: file.id,
            details: file.originalFileName,
            ipAddress: input.ipAddress ?? null,
        });
        return { file, buffer };
    }
}
exports.DownloadFileUseCase = DownloadFileUseCase;
class DeleteFileUseCase {
    fileRepository;
    auditLogRepository;
    constructor(fileRepository, auditLogRepository) {
        this.fileRepository = fileRepository;
        this.auditLogRepository = auditLogRepository;
    }
    async execute(input) {
        const file = await this.fileRepository.findById(input.id, true);
        if (!file)
            throw new app_error_1.NotFoundError('Archivo no encontrado');
        if (input.hard) {
            await this.fileRepository.hardDelete(input.id);
        }
        else {
            if (file.deletedAt)
                throw new app_error_1.ConflictError('El archivo ya está eliminado');
            await this.fileRepository.softDelete(input.id);
        }
        await this.auditLogRepository.create({
            id: (0, uuid_1.v4)(),
            apiKeyId: input.apiKeyId ?? null,
            action: constants_1.AUDIT_ACTIONS.DELETE,
            fileId: input.id,
            details: input.hard ? 'hard-delete' : 'soft-delete',
            ipAddress: input.ipAddress ?? null,
        });
    }
}
exports.DeleteFileUseCase = DeleteFileUseCase;
class RestoreFileUseCase {
    fileRepository;
    auditLogRepository;
    constructor(fileRepository, auditLogRepository) {
        this.fileRepository = fileRepository;
        this.auditLogRepository = auditLogRepository;
    }
    async execute(input) {
        const file = await this.fileRepository.findById(input.id, true);
        if (!file)
            throw new app_error_1.NotFoundError('Archivo no encontrado');
        if (!file.deletedAt)
            throw new app_error_1.ConflictError('El archivo no está eliminado');
        await this.fileRepository.restore(input.id);
        await this.auditLogRepository.create({
            id: (0, uuid_1.v4)(),
            apiKeyId: input.apiKeyId ?? null,
            action: constants_1.AUDIT_ACTIONS.RESTORE,
            fileId: input.id,
            details: null,
            ipAddress: input.ipAddress ?? null,
        });
    }
}
exports.RestoreFileUseCase = RestoreFileUseCase;
class AssignCategoriesUseCase {
    fileRepository;
    categoryRepository;
    auditLogRepository;
    constructor(fileRepository, categoryRepository, auditLogRepository) {
        this.fileRepository = fileRepository;
        this.categoryRepository = categoryRepository;
        this.auditLogRepository = auditLogRepository;
    }
    async execute(input) {
        const file = await this.fileRepository.findById(input.fileId);
        if (!file)
            throw new app_error_1.NotFoundError('Archivo no encontrado');
        const categories = await this.categoryRepository.findOrCreateByNames(input.categories);
        await this.categoryRepository.assignToFile(input.fileId, categories.map((c) => c.id));
        await this.auditLogRepository.create({
            id: (0, uuid_1.v4)(),
            apiKeyId: input.apiKeyId ?? null,
            action: constants_1.AUDIT_ACTIONS.ASSIGN_CATEGORIES,
            fileId: input.fileId,
            details: input.categories.join(', '),
            ipAddress: input.ipAddress ?? null,
        });
    }
}
exports.AssignCategoriesUseCase = AssignCategoriesUseCase;
class AssignTagsUseCase {
    fileRepository;
    tagRepository;
    auditLogRepository;
    constructor(fileRepository, tagRepository, auditLogRepository) {
        this.fileRepository = fileRepository;
        this.tagRepository = tagRepository;
        this.auditLogRepository = auditLogRepository;
    }
    async execute(input) {
        const file = await this.fileRepository.findById(input.fileId);
        if (!file)
            throw new app_error_1.NotFoundError('Archivo no encontrado');
        const tags = await this.tagRepository.findOrCreateByNames(input.tags);
        await this.tagRepository.assignToFile(input.fileId, tags.map((t) => t.id));
        await this.auditLogRepository.create({
            id: (0, uuid_1.v4)(),
            apiKeyId: input.apiKeyId ?? null,
            action: constants_1.AUDIT_ACTIONS.ASSIGN_TAGS,
            fileId: input.fileId,
            details: input.tags.join(', '),
            ipAddress: input.ipAddress ?? null,
        });
    }
}
exports.AssignTagsUseCase = AssignTagsUseCase;
class CreateFileVersionUseCase {
    fileRepository;
    fileVersionRepository;
    auditLogRepository;
    storageService;
    constructor(fileRepository, fileVersionRepository, auditLogRepository, storageService) {
        this.fileRepository = fileRepository;
        this.fileVersionRepository = fileVersionRepository;
        this.auditLogRepository = auditLogRepository;
        this.storageService = storageService;
    }
    async execute(input) {
        const file = await this.fileRepository.findById(input.fileId);
        if (!file)
            throw new app_error_1.NotFoundError('Archivo no encontrado');
        file_validator_service_1.FileValidator.validateUpload(input.originalName, input.mimeType, input.buffer.length);
        const versionNumber = (await this.fileVersionRepository.getLatestVersionNumber(input.fileId)) + 1;
        const versionId = (0, uuid_1.v4)();
        const datePath = (0, helpers_1.buildDateStoragePath)();
        const storagePath = `${datePath}/${file.id}_v${versionNumber}.${file.extension}`;
        await this.storageService.save(input.buffer, storagePath);
        const version = await this.fileVersionRepository.create({
            id: versionId,
            fileId: input.fileId,
            versionNumber,
            storagePath,
            fileSize: input.buffer.length,
        });
        await this.auditLogRepository.create({
            id: (0, uuid_1.v4)(),
            apiKeyId: input.apiKeyId ?? null,
            action: constants_1.AUDIT_ACTIONS.CREATE_VERSION,
            fileId: input.fileId,
            details: `v${versionNumber}`,
            ipAddress: input.ipAddress ?? null,
        });
        return version;
    }
}
exports.CreateFileVersionUseCase = CreateFileVersionUseCase;
class GetFileVersionsUseCase {
    fileVersionRepository;
    constructor(fileVersionRepository) {
        this.fileVersionRepository = fileVersionRepository;
    }
    async execute(fileId) {
        return this.fileVersionRepository.listByFileId(fileId);
    }
}
exports.GetFileVersionsUseCase = GetFileVersionsUseCase;
class CreateSignedUrlUseCase {
    fileRepository;
    signedUrlRepository;
    constructor(fileRepository, signedUrlRepository) {
        this.fileRepository = fileRepository;
        this.signedUrlRepository = signedUrlRepository;
    }
    async execute(fileId) {
        const file = await this.fileRepository.findById(fileId);
        if (!file)
            throw new app_error_1.NotFoundError('Archivo no encontrado');
        const token = file_validator_service_1.FileValidator.generateSignedToken();
        const expiresAt = new Date(Date.now() + env_1.env.signedUrlExpirationMinutes * 60 * 1000);
        await this.signedUrlRepository.create({
            id: (0, uuid_1.v4)(),
            fileId,
            token,
            expiresAt,
        });
        return {
            url: `${env_1.env.publicUrl}/api/files/signed/${token}`,
            expiresAt,
        };
    }
}
exports.CreateSignedUrlUseCase = CreateSignedUrlUseCase;
class DownloadBySignedUrlUseCase {
    signedUrlRepository;
    fileRepository;
    storageService;
    constructor(signedUrlRepository, fileRepository, storageService) {
        this.signedUrlRepository = signedUrlRepository;
        this.fileRepository = fileRepository;
        this.storageService = storageService;
    }
    async execute(token) {
        const signedUrl = await this.signedUrlRepository.findByToken(token);
        if (!signedUrl || signedUrl.expiresAt < new Date()) {
            throw new app_error_1.NotFoundError('URL firmada inválida o expirada');
        }
        const file = await this.fileRepository.findById(signedUrl.fileId);
        if (!file)
            throw new app_error_1.NotFoundError('Archivo no encontrado');
        const buffer = await this.storageService.read(file.storagePath);
        return { file, buffer };
    }
}
exports.DownloadBySignedUrlUseCase = DownloadBySignedUrlUseCase;
class CreateApiKeyUseCase {
    apiKeyRepository;
    constructor(apiKeyRepository) {
        this.apiKeyRepository = apiKeyRepository;
    }
    async execute(name) {
        const apiKey = file_validator_service_1.FileValidator.generateApiKey();
        return this.apiKeyRepository.create({
            id: (0, uuid_1.v4)(),
            name,
            apiKey,
            isActive: true,
        });
    }
}
exports.CreateApiKeyUseCase = CreateApiKeyUseCase;
class ListApiKeysUseCase {
    apiKeyRepository;
    constructor(apiKeyRepository) {
        this.apiKeyRepository = apiKeyRepository;
    }
    execute() {
        return this.apiKeyRepository.list();
    }
}
exports.ListApiKeysUseCase = ListApiKeysUseCase;
class UpdateApiKeyStatusUseCase {
    apiKeyRepository;
    constructor(apiKeyRepository) {
        this.apiKeyRepository = apiKeyRepository;
    }
    async execute(id, isActive) {
        const existing = await this.apiKeyRepository.findById(id);
        if (!existing)
            throw new app_error_1.NotFoundError('API Key no encontrada');
        return this.apiKeyRepository.updateStatus(id, isActive);
    }
}
exports.UpdateApiKeyStatusUseCase = UpdateApiKeyStatusUseCase;
class DeleteApiKeyUseCase {
    apiKeyRepository;
    constructor(apiKeyRepository) {
        this.apiKeyRepository = apiKeyRepository;
    }
    async execute(id) {
        const existing = await this.apiKeyRepository.findById(id);
        if (!existing)
            throw new app_error_1.NotFoundError('API Key no encontrada');
        await this.apiKeyRepository.delete(id);
    }
}
exports.DeleteApiKeyUseCase = DeleteApiKeyUseCase;
class GetMetricsUseCase {
    constructor() { }
    async execute() {
        const { prisma } = await Promise.resolve().then(() => __importStar(require('../../infrastructure/database/prisma.client')));
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const [totalFiles, sizeAgg, activeApiKeys, uploadsToday, downloadsToday] = await Promise.all([
            prisma.file.count({ where: { deletedAt: null } }),
            prisma.file.aggregate({
                where: { deletedAt: null },
                _sum: { fileSize: true },
            }),
            prisma.apiKey.count({ where: { isActive: true } }),
            prisma.auditLog.count({
                where: { action: constants_1.AUDIT_ACTIONS.UPLOAD, createdAt: { gte: startOfDay } },
            }),
            prisma.auditLog.count({
                where: { action: constants_1.AUDIT_ACTIONS.DOWNLOAD, createdAt: { gte: startOfDay } },
            }),
        ]);
        return {
            totalFiles,
            totalSizeBytes: Number(sizeAgg._sum.fileSize ?? 0),
            activeApiKeys,
            uploadsToday,
            downloadsToday,
        };
    }
}
exports.GetMetricsUseCase = GetMetricsUseCase;
class GenerateReportPdfUseCase {
    fileRepository;
    auditLogRepository;
    storageService;
    constructor(fileRepository, auditLogRepository, storageService) {
        this.fileRepository = fileRepository;
        this.auditLogRepository = auditLogRepository;
        this.storageService = storageService;
    }
    async execute(input) {
        const normalizedRows = (0, pdf_report_generator_1.normalizeReportRows)(input.rows);
        const buffer = await (0, pdf_report_generator_1.generatePdfReportBuffer)({
            title: input.title,
            headers: input.headers,
            rows: normalizedRows,
        });
        const id = (0, uuid_1.v4)();
        const datePath = (0, helpers_1.buildDateStoragePath)();
        const storagePath = `reportes/${datePath}/${id}.pdf`;
        const originalFileName = input.fileName?.trim() || `${input.title}.pdf`;
        const sanitizedName = (0, helpers_1.sanitizeFileName)(originalFileName.endsWith('.pdf')
            ? originalFileName
            : `${originalFileName}.pdf`);
        await this.storageService.save(buffer, storagePath);
        const hash = file_validator_service_1.FileValidator.computeHash(buffer);
        await this.fileRepository.create({
            id,
            fileName: `${id}.pdf`,
            originalFileName: sanitizedName,
            extension: 'pdf',
            mimeType: 'application/pdf',
            fileSize: buffer.length,
            storagePath,
            hash,
        });
        await this.auditLogRepository.create({
            id: (0, uuid_1.v4)(),
            apiKeyId: input.apiKeyId ?? null,
            action: constants_1.AUDIT_ACTIONS.GENERATE_REPORT,
            fileId: id,
            details: input.title,
            ipAddress: input.ipAddress ?? null,
        });
        return (0, result_1.ok)({
            id,
            fileName: `${id}.pdf`,
            originalFileName: sanitizedName,
            storagePath,
            url: `/api/files/download/${id}`,
        });
    }
}
exports.GenerateReportPdfUseCase = GenerateReportPdfUseCase;
//# sourceMappingURL=index.js.map