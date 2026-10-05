"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProveedoresRouter = buildProveedoresRouter;
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
const env_1 = require("../../../core/config/env");
const prisma_1 = require("../../../core/database/prisma");
const async_handler_1 = require("../../../core/http/async-handler");
const upload_service_client_1 = require("../../../shared/infrastructure/upload-service/upload-service.client");
const jwt_token_service_1 = require("../../auth/infrastructure/services/jwt-token.service");
const auth_middleware_1 = require("../../auth/presentation/middlewares/auth.middleware");
const import_proveedores_excel_service_1 = require("../application/services/import-proveedores-excel.service");
const create_proveedor_use_case_1 = require("../application/use-cases/create-proveedor.use-case");
const deactivate_proveedor_use_case_1 = require("../application/use-cases/deactivate-proveedor.use-case");
const get_proveedor_by_id_use_case_1 = require("../application/use-cases/get-proveedor-by-id.use-case");
const get_proveedores_use_case_1 = require("../application/use-cases/get-proveedores.use-case");
const update_proveedor_use_case_1 = require("../application/use-cases/update-proveedor.use-case");
const prisma_proveedor_repository_1 = require("../infrastructure/repositories/prisma-proveedor.repository");
const proveedores_controller_1 = require("./controllers/proveedores.controller");
const prisma_provincia_repository_1 = require("../../provincias/infrastructure/repositories/prisma-provincia.repository");
const prisma_municipio_repository_1 = require("../../municipios/infrastructure/repositories/prisma-municipio.repository");
const prisma_sector_repository_1 = require("../../sectores/infrastructure/repositories/prisma-sector.repository");
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
function buildProveedoresRouter() {
    const proveedorRepository = new prisma_proveedor_repository_1.PrismaProveedorRepository(prisma_1.prisma);
    const provinciaRepository = new prisma_provincia_repository_1.PrismaProvinciaRepository(prisma_1.prisma);
    const municipioRepository = new prisma_municipio_repository_1.PrismaMunicipioRepository(prisma_1.prisma);
    const sectorRepository = new prisma_sector_repository_1.PrismaSectorRepository(prisma_1.prisma);
    const getProveedores = new get_proveedores_use_case_1.GetProveedoresUseCase(proveedorRepository);
    const getProveedorById = new get_proveedor_by_id_use_case_1.GetProveedorByIdUseCase(proveedorRepository);
    const createProveedor = new create_proveedor_use_case_1.CreateProveedorUseCase(proveedorRepository, provinciaRepository, municipioRepository, sectorRepository);
    const updateProveedor = new update_proveedor_use_case_1.UpdateProveedorUseCase(proveedorRepository, provinciaRepository, municipioRepository, sectorRepository);
    const deactivateProveedor = new deactivate_proveedor_use_case_1.DeactivateProveedorUseCase(proveedorRepository);
    const importProveedoresExcel = new import_proveedores_excel_service_1.ImportProveedoresExcelService(proveedorRepository, provinciaRepository, municipioRepository, sectorRepository);
    const uploadService = new upload_service_client_1.HttpUploadServiceClient({
        baseUrl: env_1.env.uploadService.baseUrl,
        apiKey: env_1.env.uploadService.apiKey,
        apiKeyHeader: env_1.env.uploadService.apiKeyHeader,
    });
    const controller = new proveedores_controller_1.ProveedoresController(getProveedores, getProveedorById, createProveedor, updateProveedor, deactivateProveedor, proveedorRepository, uploadService, importProveedoresExcel);
    const tokenService = new jwt_token_service_1.JwtTokenService(env_1.env.jwt.secret, env_1.env.jwt.expiresIn);
    const requireAuth = (0, auth_middleware_1.authMiddleware)(tokenService);
    const router = (0, express_1.Router)();
    router.post('/importar-excel', requireAuth, excelUploadMiddleware, (0, async_handler_1.asyncHandler)(controller.importExcel));
    router.get('/', requireAuth, (0, async_handler_1.asyncHandler)(controller.list));
    router.get('/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.getById));
    router.post('/', requireAuth, (0, async_handler_1.asyncHandler)(controller.create));
    router.patch('/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.update));
    router.delete('/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.remove));
    router.get('/:id/telefonos', requireAuth, (0, async_handler_1.asyncHandler)(controller.listTelefonos));
    router.post('/:id/telefonos', requireAuth, (0, async_handler_1.asyncHandler)(controller.createTelefono));
    router.patch('/:id/telefonos/:telefonoId', requireAuth, (0, async_handler_1.asyncHandler)(controller.updateTelefono));
    router.delete('/:id/telefonos/:telefonoId', requireAuth, (0, async_handler_1.asyncHandler)(controller.removeTelefono));
    return router;
}
//# sourceMappingURL=proveedores.routes.js.map