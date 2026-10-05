"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProvinciasRouter = buildProvinciasRouter;
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
const env_1 = require("../../../core/config/env");
const prisma_1 = require("../../../core/database/prisma");
const async_handler_1 = require("../../../core/http/async-handler");
const upload_service_client_1 = require("../../../shared/infrastructure/upload-service/upload-service.client");
const jwt_token_service_1 = require("../../auth/infrastructure/services/jwt-token.service");
const auth_middleware_1 = require("../../auth/presentation/middlewares/auth.middleware");
const import_provincias_excel_service_1 = require("../application/services/import-provincias-excel.service");
const create_provincia_use_case_1 = require("../application/use-cases/create-provincia.use-case");
const deactivate_provincia_use_case_1 = require("../application/use-cases/deactivate-provincia.use-case");
const get_provincia_by_id_use_case_1 = require("../application/use-cases/get-provincia-by-id.use-case");
const get_provincias_use_case_1 = require("../application/use-cases/get-provincias.use-case");
const update_provincia_use_case_1 = require("../application/use-cases/update-provincia.use-case");
const prisma_provincia_repository_1 = require("../infrastructure/repositories/prisma-provincia.repository");
const provincias_controller_1 = require("./controllers/provincias.controller");
const excelUploadMiddleware = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const originalName = file.originalname?.toLowerCase() ?? '';
        const isExcelExt = originalName.endsWith('.xls') || originalName.endsWith('.xlsx');
        const isAllowedMime = file.mimetype === 'application/vnd.ms-excel' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.mimetype === 'application/octet-stream';
        if (!isExcelExt && !isAllowedMime) {
            cb(new Error('Solo se permiten archivos Excel (.xls o .xlsx)'));
            return;
        }
        cb(null, true);
    },
}).single('file');
function buildProvinciasRouter() {
    const repository = new prisma_provincia_repository_1.PrismaProvinciaRepository(prisma_1.prisma);
    const getProvincias = new get_provincias_use_case_1.GetProvinciasUseCase(repository);
    const getProvinciaById = new get_provincia_by_id_use_case_1.GetProvinciaByIdUseCase(repository);
    const createProvincia = new create_provincia_use_case_1.CreateProvinciaUseCase(repository);
    const updateProvincia = new update_provincia_use_case_1.UpdateProvinciaUseCase(repository);
    const deactivateProvincia = new deactivate_provincia_use_case_1.DeactivateProvinciaUseCase(repository);
    const importProvinciasExcel = new import_provincias_excel_service_1.ImportProvinciasExcelService(repository);
    const uploadService = new upload_service_client_1.HttpUploadServiceClient({
        baseUrl: env_1.env.uploadService.baseUrl,
        apiKey: env_1.env.uploadService.apiKey,
        apiKeyHeader: env_1.env.uploadService.apiKeyHeader,
    });
    const controller = new provincias_controller_1.ProvinciasController(getProvincias, getProvinciaById, createProvincia, updateProvincia, deactivateProvincia, uploadService, importProvinciasExcel);
    const tokenService = new jwt_token_service_1.JwtTokenService(env_1.env.jwt.secret, env_1.env.jwt.expiresIn);
    const requireAuth = (0, auth_middleware_1.authMiddleware)(tokenService);
    const router = (0, express_1.Router)();
    router.post('/importar-excel', requireAuth, excelUploadMiddleware, (0, async_handler_1.asyncHandler)(controller.importExcel));
    router.get('/', requireAuth, (0, async_handler_1.asyncHandler)(controller.list));
    router.get('/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.getById));
    router.post('/', requireAuth, (0, async_handler_1.asyncHandler)(controller.create));
    router.patch('/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.update));
    router.delete('/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.remove));
    return router;
}
//# sourceMappingURL=provincias.routes.js.map