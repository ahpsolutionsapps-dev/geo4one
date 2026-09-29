import { PrismaApiKeyRepository } from '../infrastructure/repositories/prisma-api-key.repository';
import { PrismaAuditLogRepository } from '../infrastructure/repositories/prisma-audit-log.repository';
import { PrismaCategoryRepository } from '../infrastructure/repositories/prisma-category.repository';
import { PrismaFileRepository } from '../infrastructure/repositories/prisma-file.repository';
import { PrismaFileVersionRepository } from '../infrastructure/repositories/prisma-file-version.repository';
import { PrismaSignedUrlRepository } from '../infrastructure/repositories/prisma-signed-url.repository';
import { PrismaTagRepository } from '../infrastructure/repositories/prisma-tag.repository';
import { LocalStorageService } from '../infrastructure/storage/local-storage.service';
import {
  AssignCategoriesUseCase,
  AssignTagsUseCase,
  CreateApiKeyUseCase,
  CreateFileVersionUseCase,
  CreateSignedUrlUseCase,
  DeleteApiKeyUseCase,
  DeleteFileUseCase,
  DownloadBySignedUrlUseCase,
  DownloadFileUseCase,
  GenerateReportPdfUseCase,
  GetFileByIdUseCase,
  GetFilesUseCase,
  GetFileVersionsUseCase,
  GetMetricsUseCase,
  ListApiKeysUseCase,
  RestoreFileUseCase,
  UpdateApiKeyStatusUseCase,
  UploadFileUseCase,
} from '../application/use-cases';

const fileRepository = new PrismaFileRepository();
const fileVersionRepository = new PrismaFileVersionRepository();
const apiKeyRepository = new PrismaApiKeyRepository();
const categoryRepository = new PrismaCategoryRepository();
const tagRepository = new PrismaTagRepository();
const signedUrlRepository = new PrismaSignedUrlRepository();
const auditLogRepository = new PrismaAuditLogRepository();
const storageService = new LocalStorageService();

export const container = {
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
    uploadFile: new UploadFileUseCase(fileRepository, auditLogRepository, storageService),
    getFiles: new GetFilesUseCase(fileRepository),
    getFileById: new GetFileByIdUseCase(fileRepository),
    downloadFile: new DownloadFileUseCase(
      fileRepository,
      auditLogRepository,
      storageService,
    ),
    deleteFile: new DeleteFileUseCase(fileRepository, auditLogRepository),
    restoreFile: new RestoreFileUseCase(fileRepository, auditLogRepository),
    assignCategories: new AssignCategoriesUseCase(
      fileRepository,
      categoryRepository,
      auditLogRepository,
    ),
    assignTags: new AssignTagsUseCase(
      fileRepository,
      tagRepository,
      auditLogRepository,
    ),
    createFileVersion: new CreateFileVersionUseCase(
      fileRepository,
      fileVersionRepository,
      auditLogRepository,
      storageService,
    ),
    getFileVersions: new GetFileVersionsUseCase(fileVersionRepository),
    createSignedUrl: new CreateSignedUrlUseCase(fileRepository, signedUrlRepository),
    downloadBySignedUrl: new DownloadBySignedUrlUseCase(
      signedUrlRepository,
      fileRepository,
      storageService,
    ),
    createApiKey: new CreateApiKeyUseCase(apiKeyRepository),
    listApiKeys: new ListApiKeysUseCase(apiKeyRepository),
    updateApiKeyStatus: new UpdateApiKeyStatusUseCase(apiKeyRepository),
    deleteApiKey: new DeleteApiKeyUseCase(apiKeyRepository),
    getMetrics: new GetMetricsUseCase(),
    generateReportPdf: new GenerateReportPdfUseCase(
      fileRepository,
      auditLogRepository,
      storageService,
    ),
  },
};

export type Container = typeof container;
