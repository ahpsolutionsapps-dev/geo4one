"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMunicipiosRouter = buildMunicipiosRouter;
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
const env_1 = require("../../../core/config/env");
const prisma_1 = require("../../../core/database/prisma");
const async_handler_1 = require("../../../core/http/async-handler");
const upload_service_client_1 = require("../../../shared/infrastructure/upload-service/upload-service.client");
const jwt_token_service_1 = require("../../auth/infrastructure/services/jwt-token.service");
const auth_middleware_1 = require("../../auth/presentation/middlewares/auth.middleware");
const import_municipios_excel_service_1 = require("../application/services/import-municipios-excel.service");
const create_municipio_use_case_1 = require("../application/use-cases/create-municipio.use-case");
const deactivate_municipio_use_case_1 = require("../application/use-cases/deactivate-municipio.use-case");
const get_municipio_by_id_use_case_1 = require("../application/use-cases/get-municipio-by-id.use-case");
const get_municipios_use_case_1 = require("../application/use-cases/get-municipios.use-case");
const update_municipio_use_case_1 = require("../application/use-cases/update-municipio.use-case");
const prisma_municipio_repository_1 = require("../infrastructure/repositories/prisma-municipio.repository");
const prisma_provincia_repository_1 = require("../../provincias/infrastructure/repositories/prisma-provincia.repository");
const municipios_controller_1 = require("./controllers/municipios.controller");
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
function buildMunicipiosRouter() {
    const municipioRepository = new prisma_municipio_repository_1.PrismaMunicipioRepository(prisma_1.prisma);
    const provinciaRepository = new prisma_provincia_repository_1.PrismaProvinciaRepository(prisma_1.prisma);
    const getMunicipios = new get_municipios_use_case_1.GetMunicipiosUseCase(municipioRepository);
    const getMunicipioById = new get_municipio_by_id_use_case_1.GetMunicipioByIdUseCase(municipioRepository);
    const createMunicipio = new create_municipio_use_case_1.CreateMunicipioUseCase(municipioRepository, provinciaRepository);
    const updateMunicipio = new update_municipio_use_case_1.UpdateMunicipioUseCase(municipioRepository, provinciaRepository);
    const deactivateMunicipio = new deactivate_municipio_use_case_1.DeactivateMunicipioUseCase(municipioRepository);
    const importMunicipiosExcel = new import_municipios_excel_service_1.ImportMunicipiosExcelService(municipioRepository, provinciaRepository);
    const uploadService = new upload_service_client_1.HttpUploadServiceClient({
        baseUrl: env_1.env.uploadService.baseUrl,
        apiKey: env_1.env.uploadService.apiKey,
        apiKeyHeader: env_1.env.uploadService.apiKeyHeader,
    });
    const controller = new municipios_controller_1.MunicipiosController(getMunicipios, getMunicipioById, createMunicipio, updateMunicipio, deactivateMunicipio, uploadService, importMunicipiosExcel);
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
//# sourceMappingURL=municipios.routes.js.map