"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMarcasProductosRouter = buildMarcasProductosRouter;
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
const env_1 = require("../../../core/config/env");
const prisma_1 = require("../../../core/database/prisma");
const async_handler_1 = require("../../../core/http/async-handler");
const upload_service_client_1 = require("../../../shared/infrastructure/upload-service/upload-service.client");
const jwt_token_service_1 = require("../../auth/infrastructure/services/jwt-token.service");
const auth_middleware_1 = require("../../auth/presentation/middlewares/auth.middleware");
const prisma_marca_producto_repository_1 = require("../infrastructure/repositories/prisma-marca-producto.repository");
const import_marcas_productos_excel_service_1 = require("../application/services/import-marcas-productos-excel.service");
const create_marca_producto_use_case_1 = require("../application/use-cases/create-marca-producto.use-case");
const deactivate_marca_producto_use_case_1 = require("../application/use-cases/deactivate-marca-producto.use-case");
const get_marca_producto_by_id_use_case_1 = require("../application/use-cases/get-marca-producto-by-id.use-case");
const get_marcas_productos_use_case_1 = require("../application/use-cases/get-marcas-productos.use-case");
const update_marca_producto_use_case_1 = require("../application/use-cases/update-marca-producto.use-case");
const marcas_productos_controller_1 = require("./controllers/marcas-productos.controller");
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
function buildMarcasProductosRouter() {
    const repository = new prisma_marca_producto_repository_1.PrismaMarcaProductoRepository(prisma_1.prisma);
    const getMarcasProductos = new get_marcas_productos_use_case_1.GetMarcasProductosUseCase(repository);
    const getMarcaProductoById = new get_marca_producto_by_id_use_case_1.GetMarcaProductoByIdUseCase(repository);
    const createMarcaProducto = new create_marca_producto_use_case_1.CreateMarcaProductoUseCase(repository);
    const updateMarcaProducto = new update_marca_producto_use_case_1.UpdateMarcaProductoUseCase(repository);
    const deactivateMarcaProducto = new deactivate_marca_producto_use_case_1.DeactivateMarcaProductoUseCase(repository);
    const importMarcasProductosExcel = new import_marcas_productos_excel_service_1.ImportMarcasProductosExcelService(repository);
    const uploadService = new upload_service_client_1.HttpUploadServiceClient({
        baseUrl: env_1.env.uploadService.baseUrl,
        apiKey: env_1.env.uploadService.apiKey,
        apiKeyHeader: env_1.env.uploadService.apiKeyHeader,
    });
    const controller = new marcas_productos_controller_1.MarcasProductosController(getMarcasProductos, getMarcaProductoById, createMarcaProducto, updateMarcaProducto, deactivateMarcaProducto, uploadService, importMarcasProductosExcel);
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
//# sourceMappingURL=marcas-productos.routes.js.map