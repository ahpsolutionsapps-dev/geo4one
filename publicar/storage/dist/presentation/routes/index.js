"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFilesRouter = buildFilesRouter;
exports.buildSignedRouter = buildSignedRouter;
exports.buildReportsRouter = buildReportsRouter;
exports.buildAdminRouter = buildAdminRouter;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_1 = require("express");
const env_1 = require("../../config/env");
const controllers_1 = require("../controllers");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const apiRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: env_1.env.rateLimit.windowMs,
    max: env_1.env.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.apiKey?.id ?? req.ip ?? 'anonymous',
    message: {
        success: false,
        message: 'Demasiadas solicitudes, intente más tarde',
        code: 'RATE_LIMIT',
    },
});
function buildFilesRouter() {
    const router = (0, express_1.Router)();
    router.use(auth_middleware_1.apiKeyMiddleware);
    router.use(apiRateLimiter);
    router.use(auth_middleware_1.sanitizeInputMiddleware);
    router.post('/upload', upload_middleware_1.uploadMiddleware, controllers_1.filesController.upload);
    router.get('/', controllers_1.filesController.list);
    router.get('/metrics', controllers_1.filesController.metrics);
    router.get('/download/:id', controllers_1.filesController.download);
    router.get('/:id/versions', controllers_1.filesController.listVersions);
    router.get('/:id', controllers_1.filesController.getById);
    router.delete('/:id', controllers_1.filesController.remove);
    router.post('/:id/restore', controllers_1.filesController.restore);
    router.post('/:id/categories', controllers_1.filesController.assignCategories);
    router.post('/:id/tags', controllers_1.filesController.assignTags);
    router.post('/:id/version', upload_middleware_1.versionUploadMiddleware, controllers_1.filesController.createVersion);
    router.post('/:id/signed-url', controllers_1.filesController.createSignedUrl);
    return router;
}
function buildSignedRouter() {
    const router = (0, express_1.Router)();
    router.get('/:token', controllers_1.filesController.downloadSigned);
    return router;
}
function buildReportsRouter() {
    const router = (0, express_1.Router)();
    router.use(auth_middleware_1.apiKeyMiddleware);
    router.use(apiRateLimiter);
    router.use(auth_middleware_1.sanitizeInputMiddleware);
    router.post('/pdf', controllers_1.reportsController.generatePdf);
    return router;
}
function buildAdminRouter() {
    const router = (0, express_1.Router)();
    router.use(auth_middleware_1.adminMiddleware);
    router.use(auth_middleware_1.sanitizeInputMiddleware);
    router.post('/apikeys', controllers_1.adminController.createApiKey);
    router.get('/apikeys', controllers_1.adminController.listApiKeys);
    router.put('/apikeys/:id', controllers_1.adminController.updateApiKey);
    router.delete('/apikeys/:id', controllers_1.adminController.deleteApiKey);
    return router;
}
//# sourceMappingURL=index.js.map