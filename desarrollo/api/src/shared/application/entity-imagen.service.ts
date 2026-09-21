import { ValidationError } from '../../core/errors/app-error';
import { extractFileIdFromUploadUrl } from '../infrastructure/upload-service/upload-service.client';
import { UploadServiceClient } from '../infrastructure/upload-service/upload-service.types';

export interface UploadEntityImagenInput {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  currentImagenUrl: string | null;
  category: string;
  tag: string;
}

export async function uploadEntityImagen(
  uploadService: UploadServiceClient,
  input: UploadEntityImagenInput,
): Promise<string> {
  if (!input.buffer.length) {
    throw new ValidationError('El archivo está vacío');
  }

  const uploaded = await uploadService.uploadFile(
    input.buffer,
    input.originalName,
    input.mimeType,
  );

  await Promise.all([
    uploadService.assignCategories(uploaded.id, [input.category]),
    uploadService.assignTags(uploaded.id, [input.tag]),
  ]);

  await deleteEntityImagenFile(uploadService, input.currentImagenUrl);

  return uploaded.url;
}

export async function deleteEntityImagenFile(
  uploadService: UploadServiceClient,
  imagenUrl: string | null,
): Promise<void> {
  if (!imagenUrl) {
    return;
  }

  const fileId = extractFileIdFromUploadUrl(imagenUrl);
  if (fileId) {
    await uploadService.deleteFile(fileId).catch(() => undefined);
  }
}
