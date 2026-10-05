"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAnunciantesRouter = buildAnunciantesRouter;
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
const env_1 = require("../../../core/config/env");
const prisma_1 = require("../../../core/database/prisma");
const async_handler_1 = require("../../../core/http/async-handler");
const upload_service_client_1 = require("../../../shared/infrastructure/upload-service/upload-service.client");
const jwt_token_service_1 = require("../../auth/infrastructure/services/jwt-token.service");
const auth_middleware_1 = require("../../auth/presentation/middlewares/auth.middleware");
const import_anunciantes_excel_service_1 = require("../application/services/import-anunciantes-excel.service");
const create_anunciante_use_case_1 = require("../application/use-cases/create-anunciante.use-case");
const deactivate_anunciante_use_case_1 = require("../application/use-cases/deactivate-anunciante.use-case");
const get_anunciante_by_id_use_case_1 = require("../application/use-cases/get-anunciante-by-id.use-case");
const get_anunciantes_use_case_1 = require("../application/use-cases/get-anunciantes.use-case");
const get_categorias_anunciantes_options_use_case_1 = require("../application/use-cases/get-categorias-anunciantes-options.use-case");
const get_sectores_industriales_options_use_case_1 = require("../application/use-cases/get-sectores-industriales-options.use-case");
const get_sub_sectores_industriales_options_use_case_1 = require("../application/use-cases/get-sub-sectores-industriales-options.use-case");
const update_anunciante_use_case_1 = require("../application/use-cases/update-anunciante.use-case");
const prisma_anunciante_repository_1 = require("../infrastructure/repositories/prisma-anunciante.repository");
const anunciantes_controller_1 = require("./controllers/anunciantes.controller");
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
function buildAnunciantesRouter() {
    const repository = new prisma_anunciante_repository_1.PrismaAnuncianteRepository(prisma_1.prisma);
    const getAnunciantes = new get_anunciantes_use_case_1.GetAnunciantesUseCase(repository);
    const getAnuncianteById = new get_anunciante_by_id_use_case_1.GetAnuncianteByIdUseCase(repository);
    const getSectoresOptions = new get_sectores_industriales_options_use_case_1.GetSectoresIndustrialesOptionsUseCase(repository);
    const getSubSectoresOptions = new get_sub_sectores_industriales_options_use_case_1.GetSubSectoresIndustrialesOptionsUseCase(repository);
    const getCategoriasOptions = new get_categorias_anunciantes_options_use_case_1.GetCategoriasAnunciantesOptionsUseCase(repository);
    const createAnunciante = new create_anunciante_use_case_1.CreateAnuncianteUseCase(repository);
    const updateAnunciante = new update_anunciante_use_case_1.UpdateAnuncianteUseCase(repository);
    const deactivateAnunciante = new deactivate_anunciante_use_case_1.DeactivateAnuncianteUseCase(repository);
    const importAnunciantesExcel = new import_anunciantes_excel_service_1.ImportAnunciantesExcelService(repository);
    const uploadService = new upload_service_client_1.HttpUploadServiceClient({
        baseUrl: env_1.env.uploadService.baseUrl,
        apiKey: env_1.env.uploadService.apiKey,
        apiKeyHeader: env_1.env.uploadService.apiKeyHeader,
    });
    const controller = new anunciantes_controller_1.AnunciantesController(getAnunciantes, getAnuncianteById, getSectoresOptions, getSubSectoresOptions, getCategoriasOptions, createAnunciante, updateAnunciante, deactivateAnunciante, uploadService, importAnunciantesExcel);
    const tokenService = new jwt_token_service_1.JwtTokenService(env_1.env.jwt.secret, env_1.env.jwt.expiresIn);
    const requireAuth = (0, auth_middleware_1.authMiddleware)(tokenService);
    const router = (0, express_1.Router)();
    router.post('/importar-excel', requireAuth, excelUploadMiddleware, (0, async_handler_1.asyncHandler)(controller.importExcel));
    router.get('/', requireAuth, (0, async_handler_1.asyncHandler)(controller.list));
    router.get('/options/sectores-industriales', requireAuth, (0, async_handler_1.asyncHandler)(controller.listSectoresOptions));
    router.get('/options/sub-sectores-industriales', requireAuth, (0, async_handler_1.asyncHandler)(controller.listSubSectoresOptions));
    router.get('/options/categorias-anunciantes', requireAuth, (0, async_handler_1.asyncHandler)(controller.listCategoriasOptions));
    router.get('/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.getById));
    router.post('/', requireAuth, (0, async_handler_1.asyncHandler)(controller.create));
    router.patch('/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.update));
    router.delete('/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.remove));
    return router;
}
//# sourceMappingURL=anunciantes.routes.js.map