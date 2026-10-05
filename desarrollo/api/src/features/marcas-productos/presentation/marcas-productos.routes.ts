import multer from 'multer';
import { Router } from 'express';
import { env } from '../../../core/config/env';
import { prisma } from '../../../core/database/prisma';
import { asyncHandler } from '../../../core/http/async-handler';
import { HttpUploadServiceClient } from '../../../shared/infrastructure/upload-service/upload-service.client';
import { JwtTokenService } from '../../auth/infrastructure/services/jwt-token.service';
import { authMiddleware } from '../../auth/presentation/middlewares/auth.middleware';
import { PrismaMarcaProductoRepository } from '../infrastructure/repositories/prisma-marca-producto.repository';
import { ImportMarcasProductosExcelService } from '../application/services/import-marcas-productos-excel.service';
import { CreateMarcaProductoUseCase } from '../application/use-cases/create-marca-producto.use-case';
import { DeactivateMarcaProductoUseCase } from '../application/use-cases/deactivate-marca-producto.use-case';
import { GetMarcaProductoByIdUseCase } from '../application/use-cases/get-marca-producto-by-id.use-case';
import { GetMarcasProductosUseCase } from '../application/use-cases/get-marcas-productos.use-case';
import { UpdateMarcaProductoUseCase } from '../application/use-cases/update-marca-producto.use-case';
import { MarcasProductosController } from './controllers/marcas-productos.controller';

const excelUploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const originalName = file.originalname?.toLowerCase() ?? '';
    const isExcelExt = originalName.endsWith('.xls') || originalName.endsWith('.xlsx');
    const isAllowedMime =
      file.mimetype === 'application/vnd.ms-excel' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mimetype === 'application/octet-stream';

    if (!isExcelExt && !isAllowedMime) {
      cb(new Error('Solo se permiten archivos Excel (.xls o .xlsx)'));
      return;
    }

    cb(null, true);
  },
}).single('file');

export function buildMarcasProductosRouter(): Router {
  const repository = new PrismaMarcaProductoRepository(prisma);
  const getMarcasProductos = new GetMarcasProductosUseCase(repository);
  const getMarcaProductoById = new GetMarcaProductoByIdUseCase(repository);
  const createMarcaProducto = new CreateMarcaProductoUseCase(repository);
  const updateMarcaProducto = new UpdateMarcaProductoUseCase(repository);
  const deactivateMarcaProducto = new DeactivateMarcaProductoUseCase(repository);
  const importMarcasProductosExcel = new ImportMarcasProductosExcelService(repository);
  const uploadService = new HttpUploadServiceClient({
    baseUrl: env.uploadService.baseUrl,
    apiKey: env.uploadService.apiKey,
    apiKeyHeader: env.uploadService.apiKeyHeader,
  });

  const controller = new MarcasProductosController(
    getMarcasProductos,
    getMarcaProductoById,
    createMarcaProducto,
    updateMarcaProducto,
    deactivateMarcaProducto,
    uploadService,
    importMarcasProductosExcel,
  );

  const tokenService = new JwtTokenService(env.jwt.secret, env.jwt.expiresIn);
  const requireAuth = authMiddleware(tokenService);

  const router = Router();
  router.post('/importar-excel', requireAuth, excelUploadMiddleware, asyncHandler(controller.importExcel));
  router.get('/', requireAuth, asyncHandler(controller.list));
  router.get('/:id', requireAuth, asyncHandler(controller.getById));
  router.post('/', requireAuth, asyncHandler(controller.create));
  router.patch('/:id', requireAuth, asyncHandler(controller.update));
  router.delete('/:id', requireAuth, asyncHandler(controller.remove));
  return router;
}