"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const prisma_api_key_repository_1 = require("../infrastructure/repositories/prisma-api-key.repository");
const prisma_audit_log_repository_1 = require("../infrastructure/repositories/prisma-audit-log.repository");
const prisma_category_repository_1 = require("../infrastructure/repositories/prisma-category.repository");
const prisma_file_repository_1 = require("../infrastructure/repositories/prisma-file.repository");
const prisma_file_version_repository_1 = require("../infrastructure/repositories/prisma-file-version.repository");
const prisma_signed_url_repository_1 = require("../infrastructure/repositories/prisma-signed-url.repository");
const prisma_tag_repository_1 = require("../infrastructure/repositories/prisma-tag.repository");
const local_storage_service_1 = require("../infrastructure/storage/local-storage.service");
const use_cases_1 = require("../application/use-cases");
const fileRepository = new prisma_file_repository_1.PrismaFileRepository();
const fileVersionRepository = new prisma_file_version_repository_1.PrismaFileVersionRepository();
const apiKeyRepository = new prisma_api_key_repository_1.PrismaApiKeyRepository();
const categoryRepository = new prisma_category_repository_1.PrismaCategoryRepository();
const tagRepository = new prisma_tag_repository_1.PrismaTagRepository();
const signedUrlRepository = new prisma_signed_url_repository_1.PrismaSignedUrlRepository();
const auditLogRepository = new prisma_audit_log_repository_1.PrismaAuditLogRepository();
const storageService = new local_storage_service_1.LocalStorageService();
exports.container = {
    repositories: {
        fileRepository,
        fileVersionRepository,
        apiKeyRepository,
        categoryRepository,
        tagRepository,
        signedUrlRepository,
        auditLogRepository,
    },
    services: {
        storageService,
    },
    useCases: {
        uploadFile: new use_cases_1.UploadFileUseCase(fileRepository, auditLogRepository, storageService),
        getFiles: new use_cases_1.GetFilesUseCase(fileRepository),
        getFileById: new use_cases_1.GetFileByIdUseCase(fileRepository),
        downloadFile: new use_cases_1.DownloadFileUseCase(fileRepository, auditLogRepository, storageService),
        deleteFile: new use_cases_1.DeleteFileUseCase(fileRepository, auditLogRepository),
        restoreFile: new use_cases_1.RestoreFileUseCase(fileRepository, auditLogRepository),
        assignCategories: new use_cases_1.AssignCategoriesUseCase(fileRepository, categoryRepository, auditLogRepository),
        assignTags: new use_cases_1.AssignTagsUseCase(fileRepository, tagRepository, auditLogRepository),
        createFileVersion: new use_cases_1.CreateFileVersionUseCase(fileRepository, fileVersionRepository, auditLogRepository, storageService),
        getFileVersions: new use_cases_1.GetFileVersionsUseCase(fileVersionRepository),
        createSignedUrl: new use_cases_1.CreateSignedUrlUseCase(fileRepository, signedUrlRepository),
        downloadBySignedUrl: new use_cases_1.DownloadBySignedUrlUseCase(signedUrlRepository, fileRepository, storageService),
        createApiKey: new use_cases_1.CreateApiKeyUseCase(apiKeyRepository),
        listApiKeys: new use_cases_1.ListApiKeysUseCase(apiKeyRepository),
        updateApiKeyStatus: new use_cases_1.UpdateApiKeyStatusUseCase(apiKeyRepository),
        deleteApiKey: new use_cases_1.DeleteApiKeyUseCase(apiKeyRepository),
        getMetrics: new use_cases_1.GetMetricsUseCase(),
        generateReportPdf: new use_cases_1.GenerateReportPdfUseCase(fileRepository, auditLogRepository, storageService),
    },
};
//# sourceMappingURL=container.js.map