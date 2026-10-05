"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapFile = mapFile;
exports.mapApiKey = mapApiKey;
exports.mapFileVersion = mapFileVersion;
exports.mapTag = mapTag;
exports.mapCategory = mapCategory;
exports.mapSignedUrl = mapSignedUrl;
exports.mapAuditLog = mapAuditLog;
function mapFile(record) {
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
function mapApiKey(record) {
    return {
        id: record.id,
        name: record.name,
        apiKey: record.apiKey,
        isActive: record.isActive,
        createdAt: record.createdAt,
        lastUsedAt: record.lastUsedAt,
    };
}
function mapFileVersion(record) {
    return {
        id: record.id,
        fileId: record.fileId,
        versionNumber: record.versionNumber,
        storagePath: record.storagePath,
        fileSize: Number(record.fileSize),
        createdAt: record.createdAt,
    };
}
function mapTag(record) {
    return { id: record.id, name: record.name };
}
function mapCategory(record) {
    return {
        id: record.id,
        name: record.name,
        description: record.description,
    };
}
function mapSignedUrl(record) {
    return {
        id: record.id,
        fileId: record.fileId,
        token: record.token,
        expiresAt: record.expiresAt,
        createdAt: record.createdAt,
    };
}
function mapAuditLog(record) {
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
//# sourceMappingURL=mappers.js.map