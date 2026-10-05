"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePagination = normalizePagination;
exports.toPaginatedResult = toPaginatedResult;
exports.sanitizeFileName = sanitizeFileName;
exports.getExtension = getExtension;
exports.buildDateStoragePath = buildDateStoragePath;
function normalizePagination(page, limit) {
    const safePage = page && page > 0 ? page : 1;
    const safeLimit = limit && limit > 0 && limit <= 100 ? limit : 20;
    return { page: safePage, limit: safeLimit };
}
function toPaginatedResult(items, total, pagination) {
    return {
        items,
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.max(1, Math.ceil(total / pagination.limit)),
    };
}
function sanitizeFileName(fileName) {
    return fileName
        .replace(/[/\\?%*:|"<>]/g, '_')
        .replace(/\.\./g, '_')
        .trim();
}
function getExtension(fileName) {
    const parts = fileName.split('.');
    if (parts.length < 2)
        return '';
    return parts.pop().toLowerCase();
}
function buildDateStoragePath(date = new Date()) {
    const year = date.getFullYear().toString();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}
//# sourceMappingURL=index.js.map