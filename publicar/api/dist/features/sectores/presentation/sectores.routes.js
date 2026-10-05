"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSectoresRouter = buildSectoresRouter;
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
const env_1 = require("../../../core/config/env");
const prisma_1 = require("../../../core/database/prisma");
const async_handler_1 = require("../../../core/http/async-handler");
const upload_service_client_1 = require("../../../shared/infrastructure/upload-service/upload-service.client");
const jwt_token_service_1 = require("../../auth/infrastructure/services/jwt-token.service");
const auth_middleware_1 = require("../../auth/presentation/middlewares/auth.middleware");
const import_sectores_excel_service_1 = require("../application/services/import-sectores-excel.service");
const create_sector_use_case_1 = require("../application/use-cases/create-sector.use-case");
const deactivate_sector_use_case_1 = require("../application/use-cases/deactivate-sector.use-case");
const get_sector_by_id_use_case_1 = require("../application/use-cases/get-sector-by-id.use-case");
const get_sectores_use_case_1 = require("../application/use-cases/get-sectores.use-case");
const update_sector_use_case_1 = require("../application/use-cases/update-sector.use-case");
const prisma_municipio_repository_1 = require("../../municipios/infrastructure/repositories/prisma-municipio.repository");
const prisma_sector_repository_1 = require("../infrastructure/repositories/prisma-sector.repository");
const sectores_controller_1 = require("./controllers/sectores.controller");
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
function buildSectoresRouter() {
    const sectorRepository = new prisma_sector_repository_1.PrismaSectorRepository(prisma_1.prisma);
    const municipioRepository = new prisma_municipio_repository_1.PrismaMunicipioRepository(prisma_1.prisma);
    const getSectores = new get_sectores_use_case_1.GetSectoresUseCase(sectorRepository);
    const getSectorById = new get_sector_by_id_use_case_1.GetSectorByIdUseCase(sectorRepository);
    const createSector = new create_sector_use_case_1.CreateSectorUseCase(sectorRepository, municipioRepository);
    const updateSector = new update_sector_use_case_1.UpdateSectorUseCase(sectorRepository, municipioRepository);
    const deactivateSector = new deactivate_sector_use_case_1.DeactivateSectorUseCase(sectorRepository);
    const importSectoresExcel = new import_sectores_excel_service_1.ImportSectoresExcelService(sectorRepository, municipioRepository);
    const uploadService = new upload_service_client_1.HttpUploadServiceClient({
        baseUrl: env_1.env.uploadService.baseUrl,
        apiKey: env_1.env.uploadService.apiKey,
        apiKeyHeader: env_1.env.uploadService.apiKeyHeader,
    });
    const controller = new sectores_controller_1.SectoresController(getSectores, getSectorById, createSector, updateSector, deactivateSector, uploadService, importSectoresExcel);
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
//# sourceMappingURL=sectores.routes.js.map