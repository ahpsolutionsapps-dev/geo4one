import { v4 as uuidv4 } from 'uuid';
import { env } from '../../config/env';
import { FileValidator } from '../../domain/services/file-validator.service';
import {
  ApiKeyRepository,
  AuditLogRepository,
  CategoryRepository,
  FileRepository,
  FileVersionRepository,
  IStorageService,
  SignedUrlRepository,
  TagRepository,
} from '../../domain/repositories';
import { AUDIT_ACTIONS } from '../../shared/constants';
import { ConflictError, NotFoundError } from '../../shared/errors/app-error';
import { buildDateStoragePath, sanitizeFileName } from '../../shared/helpers';
import { ok, Result } from '../../shared/types/result';
import { UploadFileResponseDto, GenerateReportPdfResponseDto } from '../dtos';
import {
  generatePdfReportBuffer,
  normalizeReportRows,
} from '../../infrastructure/pdf/pdf-report.generator';

export class UploadFileUseCase {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly auditLogRepository: AuditLogRepository,
    private readonly storageService: IStorageService,
  ) {}

  async execute(input: {
    buffer: Buffer;
    originalName: string;
    mimeType: string;
    apiKeyId?: string;
    ipAddress?: string;
  }): Promise<Result<UploadFileResponseDto>> {
    const { sanitizedName, extension } = FileValidator.validateUpload(
      input.originalName,
      input.mimeType,
      input.buffer.length,
    );

    const hash = FileValidator.computeHash(input.buffer);

    if (env.enableDuplicateDetection) {
      const duplicate = await this.fileRepository.findByHash(hash);
      if (duplicate) {
        return ok({
          id: duplicate.id,
          fileName: duplicate.fileName,
          url: `/api/files/download/${duplicate.id}`,
        });
      }
    }

    const id = uuidv4();
    const fileName = `${id}.${extension}`;
    const datePath = buildDateStoragePath();
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
      id: uuidv4(),
      apiKeyId: input.apiKeyId ?? null,
      action: AUDIT_ACTIONS.UPLOAD,
      fileId: id,
      details: sanitizedName,
      ipAddress: input.ipAddress ?? null,
    });

    return ok({
      id,
      fileName,
      url: `/api/files/download/${id}`,
    });
  }
}

export class GetFilesUseCase {
  constructor(private readonly fileRepository: FileRepository) {}

  execute(filters: Parameters<FileRepository['list']>[0], pagination: Parameters<FileRepository['list']>[1]) {
    return this.fileRepository.list(filters, pagination);
  }
}

export class GetFileByIdUseCase {
  constructor(private readonly fileRepository: FileRepository) {}

  async execute(id: string, includeDeleted = false) {
    const file = await this.fileRepository.findById(id, includeDeleted);
    if (!file) throw new NotFoundError('Archivo no encontrado');
    return file;
  }
}

export class DownloadFileUseCase {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly auditLogRepository: AuditLogRepository,
    private readonly storageService: IStorageService,
  ) {}

  async execute(input: {
    id: string;
    apiKeyId?: string;
    ipAddress?: string;
  }) {
    const file = await this.fileRepository.findById(input.id);
    if (!file) throw new NotFoundError('Archivo no encontrado');

    const exists = await this.storageService.exists(file.storagePath);
    if (!exists) throw new NotFoundError('Archivo físico no encontrado');

    const buffer = await this.storageService.read(file.storagePath);

    await this.auditLogRepository.create({
      id: uuidv4(),
      apiKeyId: input.apiKeyId ?? null,
      action: AUDIT_ACTIONS.DOWNLOAD,
      fileId: file.id,
      details: file.originalFileName,
      ipAddress: input.ipAddress ?? null,
    });

    return { file, buffer };
  }
}

export class DeleteFileUseCase {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async execute(input: { id: string; apiKeyId?: string; ipAddress?: string; hard?: boolean }) {
    const file = await this.fileRepository.findById(input.id, true);
    if (!file) throw new NotFoundError('Archivo no encontrado');

    if (input.hard) {
      await this.fileRepository.hardDelete(input.id);
    } else {
      if (file.deletedAt) throw new ConflictError('El archivo ya está eliminado');
      await this.fileRepository.softDelete(input.id);
    }

    await this.auditLogRepository.create({
      id: uuidv4(),
      apiKeyId: input.apiKeyId ?? null,
      action: AUDIT_ACTIONS.DELETE,
      fileId: input.id,
      details: input.hard ? 'hard-delete' : 'soft-delete',
      ipAddress: input.ipAddress ?? null,
    });
  }
}

export class RestoreFileUseCase {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async execute(input: { id: string; apiKeyId?: string; ipAddress?: string }) {
    const file = await this.fileRepository.findById(input.id, true);
    if (!file) throw new NotFoundError('Archivo no encontrado');
    if (!file.deletedAt) throw new ConflictError('El archivo no está eliminado');

    await this.fileRepository.restore(input.id);

    await this.auditLogRepository.create({
      id: uuidv4(),
      apiKeyId: input.apiKeyId ?? null,
      action: AUDIT_ACTIONS.RESTORE,
      fileId: input.id,
      details: null,
      ipAddress: input.ipAddress ?? null,
    });
  }
}

export class AssignCategoriesUseCase {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async execute(input: {
    fileId: string;
    categories: string[];
    apiKeyId?: string;
    ipAddress?: string;
  }) {
    const file = await this.fileRepository.findById(input.fileId);
    if (!file) throw new NotFoundError('Archivo no encontrado');

    const categories = await this.categoryRepository.findOrCreateByNames(input.categories);
    await this.categoryRepository.assignToFile(
      input.fileId,
      categories.map((c) => c.id),
    );

    await this.auditLogRepository.create({
      id: uuidv4(),
      apiKeyId: input.apiKeyId ?? null,
      action: AUDIT_ACTIONS.ASSIGN_CATEGORIES,
      fileId: input.fileId,
      details: input.categories.join(', '),
      ipAddress: input.ipAddress ?? null,
    });
  }
}

export class AssignTagsUseCase {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly tagRepository: TagRepository,
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async execute(input: {
    fileId: string;
    tags: string[];
    apiKeyId?: string;
    ipAddress?: string;
  }) {
    const file = await this.fileRepository.findById(input.fileId);
    if (!file) throw new NotFoundError('Archivo no encontrado');

    const tags = await this.tagRepository.findOrCreateByNames(input.tags);
    await this.tagRepository.assignToFile(
      input.fileId,
      tags.map((t) => t.id),
    );

    await this.auditLogRepository.create({
      id: uuidv4(),
      apiKeyId: input.apiKeyId ?? null,
      action: AUDIT_ACTIONS.ASSIGN_TAGS,
      fileId: input.fileId,
      details: input.tags.join(', '),
      ipAddress: input.ipAddress ?? null,
    });
  }
}

export class CreateFileVersionUseCase {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly fileVersionRepository: FileVersionRepository,
    private readonly auditLogRepository: AuditLogRepository,
    private readonly storageService: IStorageService,
  ) {}

  async execute(input: {
    fileId: string;
    buffer: Buffer;
    originalName: string;
    mimeType: string;
    apiKeyId?: string;
    ipAddress?: string;
  }) {
    const file = await this.fileRepository.findById(input.fileId);
    if (!file) throw new NotFoundError('Archivo no encontrado');

    FileValidator.validateUpload(input.originalName, input.mimeType, input.buffer.length);

    const versionNumber =
      (await this.fileVersionRepository.getLatestVersionNumber(input.fileId)) + 1;
    const versionId = uuidv4();
    const datePath = buildDateStoragePath();
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
      id: uuidv4(),
      apiKeyId: input.apiKeyId ?? null,
      action: AUDIT_ACTIONS.CREATE_VERSION,
      fileId: input.fileId,
      details: `v${versionNumber}`,
      ipAddress: input.ipAddress ?? null,
    });

    return version;
  }
}

export class GetFileVersionsUseCase {
  constructor(private readonly fileVersionRepository: FileVersionRepository) {}

  async execute(fileId: string) {
    return this.fileVersionRepository.listByFileId(fileId);
  }
}

export class CreateSignedUrlUseCase {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly signedUrlRepository: SignedUrlRepository,
  ) {}

  async execute(fileId: string): Promise<{ url: string; expiresAt: Date }> {
    const file = await this.fileRepository.findById(fileId);
    if (!file) throw new NotFoundError('Archivo no encontrado');

    const token = FileValidator.generateSignedToken();
    const expiresAt = new Date(
      Date.now() + env.signedUrlExpirationMinutes * 60 * 1000,
    );

    await this.signedUrlRepository.create({
      id: uuidv4(),
      fileId,
      token,
      expiresAt,
    });

    return {
      url: `${env.publicUrl}/api/files/signed/${token}`,
      expiresAt,
    };
  }
}

export class DownloadBySignedUrlUseCase {
  constructor(
    private readonly signedUrlRepository: SignedUrlRepository,
    private readonly fileRepository: FileRepository,
    private readonly storageService: IStorageService,
  ) {}

  async execute(token: string) {
    const signedUrl = await this.signedUrlRepository.findByToken(token);
    if (!signedUrl || signedUrl.expiresAt < new Date()) {
      throw new NotFoundError('URL firmada inválida o expirada');
    }

    const file = await this.fileRepository.findById(signedUrl.fileId);
    if (!file) throw new NotFoundError('Archivo no encontrado');

    const buffer = await this.storageService.read(file.storagePath);
    return { file, buffer };
  }
}

export class CreateApiKeyUseCase {
  constructor(private readonly apiKeyRepository: ApiKeyRepository) {}

  async execute(name: string) {
    const apiKey = FileValidator.generateApiKey();
    return this.apiKeyRepository.create({
      id: uuidv4(),
      name,
      apiKey,
      isActive: true,
    });
  }
}

export class ListApiKeysUseCase {
  constructor(private readonly apiKeyRepository: ApiKeyRepository) {}

  execute() {
    return this.apiKeyRepository.list();
  }
}

export class UpdateApiKeyStatusUseCase {
  constructor(private readonly apiKeyRepository: ApiKeyRepository) {}

  async execute(id: string, isActive: boolean) {
    const existing = await this.apiKeyRepository.findById(id);
    if (!existing) throw new NotFoundError('API Key no encontrada');
    return this.apiKeyRepository.updateStatus(id, isActive);
  }
}

export class DeleteApiKeyUseCase {
  constructor(private readonly apiKeyRepository: ApiKeyRepository) {}

  async execute(id: string) {
    const existing = await this.apiKeyRepository.findById(id);
    if (!existing) throw new NotFoundError('API Key no encontrada');
    await this.apiKeyRepository.delete(id);
  }
}

export class GetMetricsUseCase {
  constructor() {}

  async execute(): Promise<{
    totalFiles: number;
    totalSizeBytes: number;
    activeApiKeys: number;
    uploadsToday: number;
    downloadsToday: number;
  }> {
    const { prisma } = await import('../../infrastructure/database/prisma.client');
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [totalFiles, sizeAgg, activeApiKeys, uploadsToday, downloadsToday] =
      await Promise.all([
        prisma.file.count({ where: { deletedAt: null } }),
        prisma.file.aggregate({
          where: { deletedAt: null },
          _sum: { fileSize: true },
        }),
        prisma.apiKey.count({ where: { isActive: 1 } }),
        prisma.auditLog.count({
          where: { action: AUDIT_ACTIONS.UPLOAD, createdAt: { gte: startOfDay } },
        }),
        prisma.auditLog.count({
          where: { action: AUDIT_ACTIONS.DOWNLOAD, createdAt: { gte: startOfDay } },
        }),
      ]);

    return {
      totalFiles,
      totalSizeBytes: sizeAgg._sum.fileSize ?? 0,
      activeApiKeys,
      uploadsToday,
      downloadsToday,
    };
  }
}

export class GenerateReportPdfUseCase {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly auditLogRepository: AuditLogRepository,
    private readonly storageService: IStorageService,
  ) {}

  async execute(input: {
    title: string;
    headers: string[];
    rows: Array<Array<string | number | boolean | null>>;
    fileName?: string;
    apiKeyId?: string;
    ipAddress?: string;
  }): Promise<Result<GenerateReportPdfResponseDto>> {
    const normalizedRows = normalizeReportRows(input.rows);
    const buffer = await generatePdfReportBuffer({
      title: input.title,
      headers: input.headers,
      rows: normalizedRows,
    });

    const id = uuidv4();
    const datePath = buildDateStoragePath();
    const storagePath = `reportes/${datePath}/${id}.pdf`;
    const originalFileName = input.fileName?.trim() || `${input.title}.pdf`;
    const sanitizedName = sanitizeFileName(
      originalFileName.endsWith('.pdf')
        ? originalFileName
        : `${originalFileName}.pdf`,
    );

    await this.storageService.save(buffer, storagePath);

    const hash = FileValidator.computeHash(buffer);

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
      id: uuidv4(),
      apiKeyId: input.apiKeyId ?? null,
      action: AUDIT_ACTIONS.GENERATE_REPORT,
      fileId: id,
      details: input.title,
      ipAddress: input.ipAddress ?? null,
    });

    return ok({
      id,
      fileName: `${id}.pdf`,
      originalFileName: sanitizedName,
      storagePath,
      url: `/api/files/download/${id}`,
    });
  }
}
