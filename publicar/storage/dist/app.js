"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const env_1 = require("./config/env");
const prisma_client_1 = require("./infrastructure/database/prisma.client");
const local_storage_service_1 = require("./infrastructure/storage/local-storage.service");
const logger_1 = require("./infrastructure/security/logger");
const error_middleware_1 = require("./presentation/middlewares/error.middleware");
const routes_1 = require("./presentation/routes");
const swagger_1 = require("./presentation/swagger");
function createApp() {
    const app = (0, express_1.default)();
    const storageService = new local_storage_service_1.LocalStorageService();
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: env_1.env.corsOrigin === '*' ? true : env_1.env.corsOrigin.split(','),
    }));
    if (env_1.env.enableCompression) {
        app.use((0, compression_1.default)());
    }
    app.use(express_1.default.json({ limit: '1mb' }));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.get('/health', async (_req, res) => {
        const [database, storage] = await Promise.all([
            (0, prisma_client_1.isDatabaseHealthy)(),
            storageService.isStorageHealthy(),
        ]);
        res.status(database && storage ? 200 : 503).json({
            status: database && storage ? 'ok' : 'degraded',
            database,
            storage,
            timestamp: new Date().toISOString(),
        });
    });
    app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
    app.use('/api/files/signed', (0, routes_1.buildSignedRouter)());
    app.use('/api/files', (0, routes_1.buildFilesRouter)());
    app.use('/api/reports', (0, routes_1.buildReportsRouter)());
    app.use('/api/admin', (0, routes_1.buildAdminRouter)());
    app.use(error_middleware_1.errorHandler);
    logger_1.logger.info('Aplicación configurada', { port: env_1.env.port });
    return app;
}
//# sourceMappingURL=app.js.map