import { AppError } from '../../../core/errors/app-error';
import {
  UploadServiceClient,
  UploadServiceDownloadData,
  UploadServiceFileData,
  UploadServiceResponse,
  UploadServiceSignedUrlData,
  GenerateReportPdfData,
  GenerateReportPdfInput,
} from './upload-service.types';

interface HttpUploadServiceClientOptions {
  baseUrl: string;
  apiKey: string;
  apiKeyHeader?: string;
}

export class HttpUploadServiceClient implements UploadServiceClient {
  private readonly apiKeyHeader: string;

  constructor(private readonly options: HttpUploadServiceClientOptions) {
    this.apiKeyHeader = options.apiKeyHeader ?? 'X-API-KEY';
  }

  async uploadFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
  ): Promise<UploadServiceFileData> {
    const formData = new FormData();
    formData.append(
      'file',
      new Blob([buffer], { type: mimeType }),
      originalName,
    );

    const response = await fetch(`${this.options.baseUrl}/api/files/upload`, {
      method: 'POST',
      headers: {
        [this.apiKeyHeader]: this.options.apiKey,
      },
      body: formData,
    });

    const payload = (await response.json()) as UploadServiceResponse;

    if (!response.ok || !payload.success || !payload.data) {
      throw new AppError(
        payload.message ?? 'Error al subir archivo al servicio de archivos',
        response.status >= 400 ? response.status : 502,
        'UPLOAD_SERVICE_ERROR',
      );
    }

    return payload.data;
  }

  async downloadFile(fileId: string): Promise<UploadServiceDownloadData> {
    const response = await fetch(
      `${this.options.baseUrl}/api/files/download/${fileId}`,
      {
        headers: {
          [this.apiKeyHeader]: this.options.apiKey,
        },
      },
    );

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as UploadServiceResponse | null;
      throw new AppError(
        payload?.message ?? 'Error al descargar archivo del servicio de archivos',
        response.status >= 400 ? response.status : 502,
        'UPLOAD_SERVICE_ERROR',
      );
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const mimeType = response.headers.get('content-type') ?? 'application/octet-stream';
    const disposition = response.headers.get('content-disposition') ?? '';
    const fileNameMatch = disposition.match(/filename="([^"]+)"/i);
    const fileName = fileNameMatch?.[1] ?? fileId;

    return { buffer, mimeType, fileName };
  }

  async createSignedUrl(fileId: string): Promise<UploadServiceSignedUrlData> {
    const response = await fetch(
      `${this.options.baseUrl}/api/files/${fileId}/signed-url`,
      {
        method: 'POST',
        headers: {
          [this.apiKeyHeader]: this.options.apiKey,
        },
      },
    );

    const payload = (await response.json()) as UploadServiceResponse & {
      data?: UploadServiceSignedUrlData;
    };

    if (!response.ok || !payload.success || !payload.data) {
      throw new AppError(
        payload.message ?? 'Error al generar URL firmada en el servicio de archivos',
        response.status >= 400 ? response.status : 502,
        'UPLOAD_SERVICE_ERROR',
      );
    }

    return payload.data;
  }

  async deleteFile(fileId: string): Promise<void> {
    const response = await fetch(`${this.options.baseUrl}/api/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        [this.apiKeyHeader]: this.options.apiKey,
      },
    });

    if (!response.ok && response.status !== 404) {
      const payload = (await response.json().catch(() => null)) as UploadServiceResponse | null;
      throw new AppError(
        payload?.message ?? 'Error al eliminar archivo del servicio de archivos',
        response.status,
        'UPLOAD_SERVICE_ERROR',
      );
    }
  }

  async assignCategories(fileId: string, categories: string[]): Promise<void> {
    await this.postJson(`/api/files/${fileId}/categories`, { categories });
  }

  async assignTags(fileId: string, tags: string[]): Promise<void> {
    await this.postJson(`/api/files/${fileId}/tags`, { tags });
  }

  async generateReportPdf(
    input: GenerateReportPdfInput,
  ): Promise<GenerateReportPdfData> {
    const response = await fetch(`${this.options.baseUrl}/api/reports/pdf`, {
      method: 'POST',
      headers: {
        [this.apiKeyHeader]: this.options.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const payload = (await response.json()) as UploadServiceResponse & {
      data?: GenerateReportPdfData;
    };

    if (!response.ok || !payload.success || !payload.data) {
      throw new AppError(
        payload.message ?? 'Error al generar reporte PDF',
        response.status >= 400 ? response.status : 502,
        'UPLOAD_SERVICE_ERROR',
      );
    }

    return payload.data;
  }

  private async postJson(path: string, body: unknown): Promise<void> {
    const response = await fetch(`${this.options.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        [this.apiKeyHeader]: this.options.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as UploadServiceResponse | null;
      throw new AppError(
        payload?.message ?? 'Error al actualizar metadata en el servicio de archivos',
        response.status,
        'UPLOAD_SERVICE_ERROR',
      );
    }
  }
}

export function extractFileIdFromUploadUrl(url: string): string | null {
  const match = url.match(/\/download\/([0-9a-f-]{36})/i);
  return match?.[1] ?? null;
}
