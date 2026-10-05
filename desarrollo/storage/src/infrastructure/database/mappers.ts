import type {
  ApiKey,
  AuditLog,
  File,
  FileCategory,
  FileVersion,
  SignedUrl,
  Tag,
} from '@prisma/client';
import {
  ApiKeyEntity,
  AuditLogEntity,
  FileCategoryEntity,
  FileEntity,
  FileVersionEntity,
  SignedUrlEntity,
  TagEntity,
} from '../../domain/entities';

export function mapFile(record: File): FileEntity {
  return {
    id: record.id,
    fileName: record.fileName,
    originalFileName: record.originalFileName,
    extension: record.extension,
    mimeType: record.mimeType,
    fileSize: Number(record.fileSize),
    storagePath: record.storagePath,
    hash: record.hash,
    isPublic: record.isPublic,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    deletedAt: record.deletedAt,
  };
}

export function mapApiKey(record: ApiKey): ApiKeyEntity {
  return {
    id: record.id,
    name: record.name,
    apiKey: record.apiKey,
    isActive: record.isActive,
    createdAt: record.createdAt,
    lastUsedAt: record.lastUsedAt,
  };
}

export function mapFileVersion(record: FileVersion): FileVersionEntity {
  return {
    id: record.id,
    fileId: record.fileId,
    versionNumber: record.versionNumber,
    storagePath: record.storagePath,
    fileSize: Number(record.fileSize),
    createdAt: record.createdAt,
  };
}

export function mapTag(record: Tag): TagEntity {
  return { id: record.id, name: record.name };
}

export function mapCategory(record: FileCategory): FileCategoryEntity {
  return {
    id: record.id,
    name: record.name,
    description: record.description,
  };
}

export function mapSignedUrl(record: SignedUrl): SignedUrlEntity {
  return {
    id: record.id,
    fileId: record.fileId,
    token: record.token,
    expiresAt: record.expiresAt,
    createdAt: record.createdAt,
  };
}

export function mapAuditLog(record: AuditLog): AuditLogEntity {
  return {
    id: record.id,
    apiKeyId: record.apiKeyId,
    action: record.action,
    fileId: record.fileId,
    details: record.details,
    ipAddress: record.ipAddress,
    createdAt: record.createdAt,
  };
}
