export interface FileEntity {
  id: string;
  fileName: string;
  originalFileName: string;
  extension: string;
  mimeType: string;
  fileSize: number;
  storagePath: string;
  hash: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export interface FileVersionEntity {
  id: string;
  fileId: string;
  versionNumber: number;
  storagePath: string;
  fileSize: number;
  createdAt: Date;
}

export interface ApiKeyEntity {
  id: string;
  name: string;
  apiKey: string;
  isActive: boolean;
  createdAt: Date;
  lastUsedAt: Date | null;
}

export interface TagEntity {
  id: string;
  name: string;
}

export interface FileCategoryEntity {
  id: string;
  name: string;
  description: string | null;
}

export interface SignedUrlEntity {
  id: string;
  fileId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface AuditLogEntity {
  id: string;
  apiKeyId: string | null;
  action: string;
  fileId: string | null;
  details: string | null;
  ipAddress: string | null;
  createdAt: Date;
}
