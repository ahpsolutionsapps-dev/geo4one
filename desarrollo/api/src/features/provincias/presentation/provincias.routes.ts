import multer from 'multer';
import { Router } from 'express';
import { env } from '../../../core/config/env';
import { prisma } from '../../../core/database/prisma';
import { asyncHandler } from '../../../core/http/async-handler';
import { HttpUploadServiceClient } from '../../../shared/infrastructure/upload-service/upload-service.client';
import { JwtTokenService } from '../../auth/infrastructure/services/jwt-token.service';
import { authMiddleware } from '../../auth/presentation/middlewares/auth.middleware';
import { ImportProvinciasExcelService } from '../application/services/import-provincias-excel.service';
import { CreateProvinciaUseCase } from '../application/use-cases/create-provincia.use-case';
import { DeactivateProvinciaUseCase } from '../application/use-cases/deactivate-provincia.use-case';
import { GetProvinciaByIdUseCase } from '../application/use-cases/get-provincia-by-id.use-case';
import { GetProvinciasUseCase } from '../application/use-cases/get-provincias.use-case';
import { UpdateProvinciaUseCase } from '../application/use-cases/update-provincia.use-case';
import { PrismaProvinciaRepository } from '../infrastructure/repositories/prisma-provincia.repository';
import { ProvinciasController } from './controllers/provincias.controller';

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

export function buildProvinciasRouter(): Router {
  const repository = new PrismaProvinciaRepository(prisma);
  const getProvincias = new GetProvinciasUseCase(repository);
  const getProvinciaById = new GetProvinciaByIdUseCase(repository);
  const createProvincia = new CreateProvinciaUseCase(repository);
  const updateProvincia = new UpdateProvinciaUseCase(repository);
  const deactivateProvincia = new DeactivateProvinciaUseCase(repository);
  const importProvinciasExcel = new ImportProvinciasExcelService(repository);
  const uploadService = new HttpUploadServiceClient({
    baseUrl: env.uploadService.baseUrl,
    apiKey: env.uploadService.apiKey,
    apiKeyHeader: env.uploadService.apiKeyHeader,
  });

  const controller = new ProvinciasController(
    getProvincias,
    getProvinciaById,
    createProvincia,
    updateProvincia,
    deactivateProvincia,
    uploadService,
    importProvinciasExcel,
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
