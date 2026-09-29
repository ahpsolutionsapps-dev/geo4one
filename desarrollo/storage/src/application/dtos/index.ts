export interface UploadFileResponseDto {
  id: string;
  fileName: string;
  url: string;
}

export interface FileMetadataDto {
  id: string;
  fileName: string;
  originalFileName: string;
  extension: string;
  mimeType: string;
  fileSize: number;
  hash: string | null;
  downloadUrl: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface ApiKeyResponseDto {
  id: string;
  name: string;
  apiKey?: string;
  isActive: boolean;
  createdAt: string;
  lastUsedAt: string | null;
}

export interface FileVersionDto {
  id: string;
  fileId: string;
  versionNumber: number;
  fileSize: number;
  createdAt: string;
}

export interface SignedUrlResponseDto {
  url: string;
  expiresAt: string;
}

export interface MetricsDto {
  totalFiles: number;
  totalSizeBytes: number;
  activeApiKeys: number;
  uploadsToday: number;
  downloadsToday: number;
}

export interface GenerateReportPdfResponseDto {
  id: string;
  fileName: string;
  originalFileName: string;
  storagePath: string;
  url: string;
}
