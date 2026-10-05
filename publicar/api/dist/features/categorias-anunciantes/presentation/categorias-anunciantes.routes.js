"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCategoriasAnunciantesRouter = buildCategoriasAnunciantesRouter;
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
const env_1 = require("../../../core/config/env");
const prisma_1 = require("../../../core/database/prisma");
const async_handler_1 = require("../../../core/http/async-handler");
const upload_service_client_1 = require("../../../shared/infrastructure/upload-service/upload-service.client");
const jwt_token_service_1 = require("../../auth/infrastructure/services/jwt-token.service");
const auth_middleware_1 = require("../../auth/presentation/middlewares/auth.middleware");
const prisma_sector_industrial_repository_1 = require("../../sectores-industriales/infrastructure/repositories/prisma-sector-industrial.repository");
const prisma_sub_sector_industrial_repository_1 = require("../../sub-sectores-industriales/infrastructure/repositories/prisma-sub-sector-industrial.repository");
const import_categorias_anunciantes_excel_service_1 = require("../application/services/import-categorias-anunciantes-excel.service");
const create_categoria_anunciante_use_case_1 = require("../application/use-cases/create-categoria-anunciante.use-case");
const deactivate_categoria_anunciante_use_case_1 = require("../application/use-cases/deactivate-categoria-anunciante.use-case");
const get_categoria_anunciante_by_id_use_case_1 = require("../application/use-cases/get-categoria-anunciante-by-id.use-case");
const get_categorias_anunciantes_use_case_1 = require("../application/use-cases/get-categorias-anunciantes.use-case");
const update_categoria_anunciante_use_case_1 = require("../application/use-cases/update-categoria-anunciante.use-case");
const prisma_categoria_anunciante_repository_1 = require("../infrastructure/repositories/prisma-categoria-anunciante.repository");
const categorias_anunciantes_controller_1 = require("./controllers/categorias-anunciantes.controller");
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
function buildCategoriasAnunciantesRouter() {
    const categoriaRepository = new prisma_categoria_anunciante_repository_1.PrismaCategoriaAnuncianteRepository(prisma_1.prisma);
    const sectorRepository = new prisma_sector_industrial_repository_1.PrismaSectorIndustrialRepository(prisma_1.prisma);
    const subSectorRepository = new prisma_sub_sector_industrial_repository_1.PrismaSubSectorIndustrialRepository(prisma_1.prisma);
    const getCategoriasAnunciantes = new get_categorias_anunciantes_use_case_1.GetCategoriasAnunciantesUseCase(categoriaRepository);
    const getCategoriaAnuncianteById = new get_categoria_anunciante_by_id_use_case_1.GetCategoriaAnuncianteByIdUseCase(categoriaRepository);
    const createCategoriaAnunciante = new create_categoria_anunciante_use_case_1.CreateCategoriaAnuncianteUseCase(categoriaRepository, sectorRepository, subSectorRepository);
    const updateCategoriaAnunciante = new update_categoria_anunciante_use_case_1.UpdateCategoriaAnuncianteUseCase(categoriaRepository, sectorRepository, subSectorRepository);
    const deactivateCategoriaAnunciante = new deactivate_categoria_anunciante_use_case_1.DeactivateCategoriaAnuncianteUseCase(categoriaRepository);
    const importCategoriasAnunciantesExcel = new import_categorias_anunciantes_excel_service_1.ImportCategoriasAnunciantesExcelService(categoriaRepository, sectorRepository, subSectorRepository);
    const uploadService = new upload_service_client_1.HttpUploadServiceClient({
        baseUrl: env_1.env.uploadService.baseUrl,
        apiKey: env_1.env.uploadService.apiKey,
        apiKeyHeader: env_1.env.uploadService.apiKeyHeader,
    });
    const controller = new categorias_anunciantes_controller_1.CategoriasAnunciantesController(getCategoriasAnunciantes, getCategoriaAnuncianteById, createCategoriaAnunciante, updateCategoriaAnunciante, deactivateCategoriaAnunciante, uploadService, importCategoriasAnunciantesExcel);
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
//# sourceMappingURL=categorias-anunciantes.routes.js.map