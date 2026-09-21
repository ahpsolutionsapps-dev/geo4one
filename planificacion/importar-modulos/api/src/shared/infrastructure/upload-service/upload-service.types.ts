export interface UploadServiceFileData {
  id: string;
  fileName: string;
  url: string;
}

export interface UploadServiceResponse {
  success: boolean;
  message: string;
  data?: UploadServiceFileData;
}

export interface UploadServiceDownloadData {
  buffer: Buffer;
  mimeType: string;
  fileName: string;
}

export interface GenerateReportPdfInput {
  title: string;
  headers: string[];
  rows: Array<Array<string | number | boolean | null>>;
  fileName?: string;
}

export interface GenerateReportPdfData {
  id: string;
  fileName: string;
  originalFileName: string;
  storagePath: string;
  url: string;
  downloadUrl: string;
}

export interface UploadServiceSignedUrlData {
  url: string;
  expiresAt: string;
}

export interface UploadServiceClient {
  uploadFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
  ): Promise<UploadServiceFileData>;
  downloadFile(fileId: string): Promise<UploadServiceDownloadData>;
  createSignedUrl(fileId: string): Promise<UploadServiceSignedUrlData>;
  deleteFile(fileId: string): Promise<void>;
  assignCategories(fileId: string, categories: string[]): Promise<void>;
  assignTags(fileId: string, tags: string[]): Promise<void>;
  generateReportPdf(input: GenerateReportPdfInput): Promise<GenerateReportPdfData>;
}
