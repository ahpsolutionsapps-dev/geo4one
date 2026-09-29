import { PaginationParams, PaginatedResult } from '../../shared/types';
import {
  ApiKeyEntity,
  AuditLogEntity,
  FileCategoryEntity,
  FileEntity,
  FileVersionEntity,
  SignedUrlEntity,
  TagEntity,
} from '../entities';

export interface FileListFilters {
  fileName?: string;
  mimeType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  category?: string;
  tag?: string;
  includeDeleted?: boolean;
}

export interface CreateFileData {
  id: string;
  fileName: string;
  originalFileName: string;
  extension: string;
  mimeType: string;
  fileSize: number;
  storagePath: string;
  hash: string | null;
}

export interface FileRepository {
  create(data: CreateFileData): Promise<FileEntity>;
  findById(id: string, includeDeleted?: boolean): Promise<FileEntity | null>;
  findByHash(hash: string): Promise<FileEntity | null>;
  list(
    filters: FileListFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<FileEntity>>;
  softDelete(id: string): Promise<void>;
  restore(id: string): Promise<void>;
  hardDelete(id: string): Promise<void>;
}

export interface FileVersionRepository {
  create(data: Omit<FileVersionEntity, 'createdAt'>): Promise<FileVersionEntity>;
  listByFileId(fileId: string): Promise<FileVersionEntity[]>;
  getLatestVersionNumber(fileId: string): Promise<number>;
}

export interface ApiKeyRepository {
  create(data: Omit<ApiKeyEntity, 'createdAt' | 'lastUsedAt'>): Promise<ApiKeyEntity>;
  findByKey(apiKey: string): Promise<ApiKeyEntity | null>;
  findById(id: string): Promise<ApiKeyEntity | null>;
  list(): Promise<ApiKeyEntity[]>;
  updateStatus(id: string, isActive: boolean): Promise<ApiKeyEntity>;
  updateLastUsed(id: string): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface CategoryRepository {
  findOrCreateByNames(names: string[]): Promise<FileCategoryEntity[]>;
  assignToFile(fileId: string, categoryIds: string[]): Promise<void>;
}

export interface TagRepository {
  findOrCreateByNames(names: string[]): Promise<TagEntity[]>;
  assignToFile(fileId: string, tagIds: string[]): Promise<void>;
}

export interface SignedUrlRepository {
  create(data: Omit<SignedUrlEntity, 'createdAt'>): Promise<SignedUrlEntity>;
  findByToken(token: string): Promise<SignedUrlEntity | null>;
  deleteExpired(): Promise<void>;
}

export interface AuditLogRepository {
  create(data: Omit<AuditLogEntity, 'createdAt'>): Promise<void>;
}

export interface IStorageService {
  save(buffer: Buffer, relativePath: string): Promise<string>;
  read(relativePath: string): Promise<Buffer>;
  delete(relativePath: string): Promise<void>;
  exists(relativePath: string): Promise<boolean>;
  getAbsolutePath(relativePath: string): string;
  ensureDirectory(relativePath: string): Promise<void>;
  isStorageHealthy(): Promise<boolean>;
}
