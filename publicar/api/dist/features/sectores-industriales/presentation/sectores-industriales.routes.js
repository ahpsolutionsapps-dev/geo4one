"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSectoresIndustrialesRouter = buildSectoresIndustrialesRouter;
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
const env_1 = require("../../../core/config/env");
const prisma_1 = require("../../../core/database/prisma");
const async_handler_1 = require("../../../core/http/async-handler");
const upload_service_client_1 = require("../../../shared/infrastructure/upload-service/upload-service.client");
const jwt_token_service_1 = require("../../auth/infrastructure/services/jwt-token.service");
const auth_middleware_1 = require("../../auth/presentation/middlewares/auth.middleware");
const import_sectores_industriales_excel_service_1 = require("../application/services/import-sectores-industriales-excel.service");
const create_sector_industrial_use_case_1 = require("../application/use-cases/create-sector-industrial.use-case");
const deactivate_sector_industrial_use_case_1 = require("../application/use-cases/deactivate-sector-industrial.use-case");
const get_sector_industrial_by_id_use_case_1 = require("../application/use-cases/get-sector-industrial-by-id.use-case");
const get_sectores_industriales_use_case_1 = require("../application/use-cases/get-sectores-industriales.use-case");
const update_sector_industrial_use_case_1 = require("../application/use-cases/update-sector-industrial.use-case");
const prisma_sector_industrial_repository_1 = require("../infrastructure/repositories/prisma-sector-industrial.repository");
const sectores_industriales_controller_1 = require("./controllers/sectores-industriales.controller");
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
function buildSectoresIndustrialesRouter() {
    const repository = new prisma_sector_industrial_repository_1.PrismaSectorIndustrialRepository(prisma_1.prisma);
    const getSectoresIndustriales = new get_sectores_industriales_use_case_1.GetSectoresIndustrialesUseCase(repository);
    const getSectorIndustrialById = new get_sector_industrial_by_id_use_case_1.GetSectorIndustrialByIdUseCase(repository);
    const createSectorIndustrial = new create_sector_industrial_use_case_1.CreateSectorIndustrialUseCase(repository);
    const updateSectorIndustrial = new update_sector_industrial_use_case_1.UpdateSectorIndustrialUseCase(repository);
    const deactivateSectorIndustrial = new deactivate_sector_industrial_use_case_1.DeactivateSectorIndustrialUseCase(repository);
    const importSectoresIndustrialesExcel = new import_sectores_industriales_excel_service_1.ImportSectoresIndustrialesExcelService(repository);
    const uploadService = new upload_service_client_1.HttpUploadServiceClient({
        baseUrl: env_1.env.uploadService.baseUrl,
        apiKey: env_1.env.uploadService.apiKey,
        apiKeyHeader: env_1.env.uploadService.apiKeyHeader,
    });
    const controller = new sectores_industriales_controller_1.SectoresIndustrialesController(getSectoresIndustriales, getSectorIndustrialById, createSectorIndustrial, updateSectorIndustrial, deactivateSectorIndustrial, uploadService, importSectoresIndustrialesExcel);
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
//# sourceMappingURL=sectores-industriales.routes.js.map