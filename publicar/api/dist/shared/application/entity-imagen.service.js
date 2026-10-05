"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadEntityImagen = uploadEntityImagen;
exports.deleteEntityImagenFile = deleteEntityImagenFile;
const app_error_1 = require("../../core/errors/app-error");
const upload_service_client_1 = require("../infrastructure/upload-service/upload-service.client");
async function uploadEntityImagen(uploadService, input) {
    if (!input.buffer.length) {
        throw new app_error_1.ValidationError('El archivo está vacío');
    }
    const uploaded = await uploadService.uploadFile(input.buffer, input.originalName, input.mimeType);
    await Promise.all([
        uploadService.assignCategories(uploaded.id, [input.category]),
        uploadService.assignTags(uploaded.id, [input.tag]),
    ]);
    await deleteEntityImagenFile(uploadService, input.currentImagenUrl);
    return uploaded.url;
}
async function deleteEntityImagenFile(uploadService, imagenUrl) {
    if (!imagenUrl) {
        return;
    }
    const fileId = (0, upload_service_client_1.extractFileIdFromUploadUrl)(imagenUrl);
    if (fileId) {
        await uploadService.deleteFile(fileId).catch(() => undefined);
    }
}
//# sourceMappingURL=entity-imagen.service.js.map