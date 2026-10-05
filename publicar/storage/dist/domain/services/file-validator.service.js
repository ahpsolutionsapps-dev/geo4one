"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileValidator = void 0;
const crypto_1 = require("crypto");
const env_1 = require("../../config/env");
const app_error_1 = require("../../shared/errors/app-error");
const helpers_1 = require("../../shared/helpers");
const DANGEROUS_EXTENSIONS = ['exe', 'bat', 'cmd', 'sh', 'ps1', 'msi', 'dll', 'scr'];
class FileValidator {
    static validateUpload(originalName, mimeType, size) {
        if (!env_1.env.enableFileValidation) {
            return {
                sanitizedName: (0, helpers_1.sanitizeFileName)(originalName),
                extension: (0, helpers_1.getExtension)(originalName),
            };
        }
        const sanitizedName = (0, helpers_1.sanitizeFileName)(originalName);
        if (!sanitizedName || sanitizedName.length > 255) {
            throw new app_error_1.ValidationError('Nombre de archivo inválido');
        }
        const extension = (0, helpers_1.getExtension)(sanitizedName);
        if (!extension) {
            throw new app_error_1.ValidationError('El archivo debe tener extensión');
        }
        if (DANGEROUS_EXTENSIONS.includes(extension)) {
            throw new app_error_1.ValidationError('Tipo de archivo no permitido por seguridad');
        }
        if (!env_1.env.allowedExtensions.includes(extension)) {
            throw new app_error_1.ValidationError(`Extensión no permitida: ${extension}`);
        }
        const normalizedMime = mimeType.toLowerCase();
        if (!env_1.env.allowedMimeTypes.includes(normalizedMime)) {
            throw new app_error_1.ValidationError(`MIME type no permitido: ${mimeType}`);
        }
        if (size <= 0) {
            throw new app_error_1.ValidationError('El archivo está vacío');
        }
        if (size > env_1.env.maxFileSize) {
            throw new app_error_1.ValidationError(`El archivo excede el tamaño máximo de ${env_1.env.maxFileSize} bytes`);
        }
        return { sanitizedName, extension };
    }
    static computeHash(buffer) {
        return (0, crypto_1.createHash)('sha256').update(buffer).digest('hex');
    }
    static generateApiKey() {
        return (0, crypto_1.randomBytes)(32).toString('hex');
    }
    static generateSignedToken() {
        return (0, crypto_1.randomBytes)(48).toString('hex');
    }
}
exports.FileValidator = FileValidator;
//# sourceMappingURL=file-validator.service.js.map