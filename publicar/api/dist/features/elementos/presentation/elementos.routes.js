"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildElementosRouter = buildElementosRouter;
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
const prisma_1 = require("../../../core/database/prisma");
const async_handler_1 = require("../../../core/http/async-handler");
const jwt_token_service_1 = require("../../auth/infrastructure/services/jwt-token.service");
const auth_middleware_1 = require("../../auth/presentation/middlewares/auth.middleware");
const env_1 = require("../../../core/config/env");
const upload_service_client_1 = require("../../../shared/infrastructure/upload-service/upload-service.client");
const import_catalogos_elementos_excel_service_1 = require("../application/services/import-catalogos-elementos-excel.service");
const import_elementos_excel_service_1 = require("../application/services/import-elementos-excel.service");
const anular_elemento_use_case_1 = require("../application/use-cases/anular-elemento.use-case");
const create_elemento_use_case_1 = require("../application/use-cases/create-elemento.use-case");
const get_elemento_by_id_use_case_1 = require("../application/use-cases/get-elemento-by-id.use-case");
const get_elementos_use_case_1 = require("../application/use-cases/get-elementos.use-case");
const update_elemento_use_case_1 = require("../application/use-cases/update-elemento.use-case");
const prisma_elemento_repository_1 = require("../infrastructure/repositories/prisma-elemento.repository");
const elementos_controller_1 = require("./controllers/elementos.controller");
const prisma_proveedor_repository_1 = require("../../proveedores/infrastructure/repositories/prisma-proveedor.repository");
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
function buildElementosRouter() {
    const repository = new prisma_elemento_repository_1.PrismaElementoRepository(prisma_1.prisma);
    const proveedoresRepository = new prisma_proveedor_repository_1.PrismaProveedorRepository(prisma_1.prisma);
    const provinciasRepository = new prisma_provincia_repository_1.PrismaProvinciaRepository(prisma_1.prisma);
    const municipiosRepository = new prisma_municipio_repository_1.PrismaMunicipioRepository(prisma_1.prisma);
    const sectoresRepository = new prisma_sector_repository_1.PrismaSectorRepository(prisma_1.prisma);
    const getElementos = new get_elementos_use_case_1.GetElementosUseCase(repository);
    const getElementoById = new get_elemento_by_id_use_case_1.GetElementoByIdUseCase(repository);
    const createElemento = new create_elemento_use_case_1.CreateElementoUseCase(repository);
    const updateElemento = new update_elemento_use_case_1.UpdateElementoUseCase(repository);
    const anularElemento = new anular_elemento_use_case_1.AnularElementoUseCase(repository);
    const importCatalogosExcel = new import_catalogos_elementos_excel_service_1.ImportCatalogosElementosExcelService(repository);
    const importElementosExcel = new import_elementos_excel_service_1.ImportElementosExcelService(repository, proveedoresRepository, provinciasRepository, municipiosRepository, sectoresRepository);
    const uploadService = new upload_service_client_1.HttpUploadServiceClient({
        baseUrl: env_1.env.uploadService.baseUrl,
        apiKey: env_1.env.uploadService.apiKey,
        apiKeyHeader: env_1.env.uploadService.apiKeyHeader,
    });
    const controller = new elementos_controller_1.ElementosController(getElementos, getElementoById, createElemento, updateElemento, anularElemento, repository, uploadService, importCatalogosExcel, importElementosExcel);
    const tokenService = new jwt_token_service_1.JwtTokenService(env_1.env.jwt.secret, env_1.env.jwt.expiresIn);
    const requireAuth = (0, auth_middleware_1.authMiddleware)(tokenService);
    const router = (0, express_1.Router)();
    router.post('/catalogos/tipos-elementos/importar-excel', requireAuth, excelUploadMiddleware, (0, async_handler_1.asyncHandler)(controller.importTiposElementosExcel));
    router.get('/catalogos/tipos-elementos', requireAuth, (0, async_handler_1.asyncHandler)(controller.listTiposElementos));
    router.post('/catalogos/tipos-elementos', requireAuth, (0, async_handler_1.asyncHandler)(controller.createTipoElemento));
    router.patch('/catalogos/tipos-elementos/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.updateTipoElemento));
    router.delete('/catalogos/tipos-elementos/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.removeTipoElemento));
    router.post('/catalogos/orientaciones/importar-excel', requireAuth, excelUploadMiddleware, (0, async_handler_1.asyncHandler)(controller.importOrientacionesExcel));
    router.get('/catalogos/orientaciones', requireAuth, (0, async_handler_1.asyncHandler)(controller.listOrientaciones));
    router.post('/catalogos/orientaciones', requireAuth, (0, async_handler_1.asyncHandler)(controller.createOrientacion));
    router.patch('/catalogos/orientaciones/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.updateOrientacion));
    router.delete('/catalogos/orientaciones/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.removeOrientacion));
    router.post('/catalogos/dimensiones/importar-excel', requireAuth, excelUploadMiddleware, (0, async_handler_1.asyncHandler)(controller.importDimensionesExcel));
    router.get('/catalogos/dimensiones', requireAuth, (0, async_handler_1.asyncHandler)(controller.listDimensiones));
    router.post('/catalogos/dimensiones', requireAuth, (0, async_handler_1.asyncHandler)(controller.createDimension));
    router.patch('/catalogos/dimensiones/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.updateDimension));
    router.delete('/catalogos/dimensiones/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.removeDimension));
    router.post('/catalogos/tipos-formatos/importar-excel', requireAuth, excelUploadMiddleware, (0, async_handler_1.asyncHandler)(controller.importFormatosExcel));
    router.get('/catalogos/tipos-formatos', requireAuth, (0, async_handler_1.asyncHandler)(controller.listFormatos));
    router.post('/catalogos/tipos-formatos', requireAuth, (0, async_handler_1.asyncHandler)(controller.createFormato));
    router.patch('/catalogos/tipos-formatos/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.updateFormato));
    router.delete('/catalogos/tipos-formatos/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.removeFormato));
    router.post('/importar-excel', requireAuth, excelUploadMiddleware, (0, async_handler_1.asyncHandler)(controller.importElementosExcel));
    router.get('/', requireAuth, (0, async_handler_1.asyncHandler)(controller.list));
    router.get('/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.getById));
    router.post('/', requireAuth, (0, async_handler_1.asyncHandler)(controller.create));
    router.patch('/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.update));
    router.delete('/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.remove));
    return router;
}
//# sourceMappingURL=elementos.routes.js.map