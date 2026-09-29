import { createHash, randomBytes } from 'crypto';
import { env } from '../../config/env';
import { ValidationError } from '../../shared/errors/app-error';
import { getExtension, sanitizeFileName } from '../../shared/helpers';

const DANGEROUS_EXTENSIONS = ['exe', 'bat', 'cmd', 'sh', 'ps1', 'msi', 'dll', 'scr'];

export class FileValidator {
  static validateUpload(
    originalName: string,
    mimeType: string,
    size: number,
  ): { sanitizedName: string; extension: string } {
    if (!env.enableFileValidation) {
      return {
        sanitizedName: sanitizeFileName(originalName),
        extension: getExtension(originalName),
      };
    }

    const sanitizedName = sanitizeFileName(originalName);
    if (!sanitizedName || sanitizedName.length > 255) {
      throw new ValidationError('Nombre de archivo inválido');
    }

    const extension = getExtension(sanitizedName);
    if (!extension) {
      throw new ValidationError('El archivo debe tener extensión');
    }

    if (DANGEROUS_EXTENSIONS.includes(extension)) {
      throw new ValidationError('Tipo de archivo no permitido por seguridad');
    }

    if (!env.allowedExtensions.includes(extension)) {
      throw new ValidationError(`Extensión no permitida: ${extension}`);
    }

    const normalizedMime = mimeType.toLowerCase();
    if (!env.allowedMimeTypes.includes(normalizedMime)) {
      throw new ValidationError(`MIME type no permitido: ${mimeType}`);
    }

    if (size <= 0) {
      throw new ValidationError('El archivo está vacío');
    }

    if (size > env.maxFileSize) {
      throw new ValidationError(
        `El archivo excede el tamaño máximo de ${env.maxFileSize} bytes`,
      );
    }

    return { sanitizedName, extension };
  }

  static computeHash(buffer: Buffer): string {
    return createHash('sha256').update(buffer).digest('hex');
  }

  static generateApiKey(): string {
    return randomBytes(32).toString('hex');
  }

  static generateSignedToken(): string {
    return randomBytes(48).toString('hex');
  }
}
