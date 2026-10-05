"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyMiddleware = apiKeyMiddleware;
exports.adminMiddleware = adminMiddleware;
exports.sanitizeInputMiddleware = sanitizeInputMiddleware;
const env_1 = require("../../config/env");
const container_1 = require("../../config/container");
const constants_1 = require("../../shared/constants");
const app_error_1 = require("../../shared/errors/app-error");
const logger_1 = require("../../infrastructure/security/logger");
const uuid_1 = require("uuid");
async function apiKeyMiddleware(req, _res, next) {
    try {
        const apiKeyValue = req.header(env_1.env.apiKeyHeader);
        if (!apiKeyValue) {
            throw new app_error_1.UnauthorizedError(`Header ${env_1.env.apiKeyHeader} requerido`);
        }
        const apiKey = await container_1.container.repositories.apiKeyRepository.findByKey(apiKeyValue);
        if (!apiKey) {
            await container_1.container.repositories.auditLogRepository.create({
                id: (0, uuid_1.v4)(),
                apiKeyId: null,
                action: constants_1.AUDIT_ACTIONS.REJECTED,
                fileId: null,
                details: 'API Key inválida',
                ipAddress: req.ip ?? null,
            });
            logger_1.logger.warn('Acceso rechazado: API Key inválida', { ip: req.ip });
            throw new app_error_1.UnauthorizedError('API Key inválida');
        }
        if (!apiKey.isActive) {
            await container_1.container.repositories.auditLogRepository.create({
                id: (0, uuid_1.v4)(),
                apiKeyId: apiKey.id,
                action: constants_1.AUDIT_ACTIONS.REJECTED,
                fileId: null,
                details: 'API Key inactiva',
                ipAddress: req.ip ?? null,
            });
            throw new app_error_1.UnauthorizedError('API Key inactiva');
        }
        await container_1.container.repositories.apiKeyRepository.updateLastUsed(apiKey.id);
        req.apiKey = { id: apiKey.id, name: apiKey.name };
        next();
    }
    catch (error) {
        next(error);
    }
}
function adminMiddleware(req, _res, next) {
    const adminToken = req.header('X-Admin-Token');
    if (!adminToken || adminToken !== env_1.env.adminToken) {
        next(new app_error_1.UnauthorizedError('Token de administración inválido'));
        return;
    }
    next();
}
function sanitizeInputMiddleware(req, _res, next) {
    if (req.body && typeof req.body === 'object') {
        for (const [key, value] of Object.entries(req.body)) {
            if (typeof value === 'string') {
                req.body[key] = value.replace(/[<>]/g, '').trim();
            }
        }
    }
    next();
}
//# sourceMappingURL=auth.middleware.js.map