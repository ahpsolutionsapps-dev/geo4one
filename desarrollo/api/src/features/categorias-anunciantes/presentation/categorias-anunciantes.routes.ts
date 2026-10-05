import multer from 'multer';
import { Router } from 'express';
import { env } from '../../../core/config/env';
import { prisma } from '../../../core/database/prisma';
import { asyncHandler } from '../../../core/http/async-handler';
import { HttpUploadServiceClient } from '../../../shared/infrastructure/upload-service/upload-service.client';
import { JwtTokenService } from '../../auth/infrastructure/services/jwt-token.service';
import { authMiddleware } from '../../auth/presentation/middlewares/auth.middleware';
import { PrismaSectorIndustrialRepository } from '../../sectores-industriales/infrastructure/repositories/prisma-sector-industrial.repository';
import { PrismaSubSectorIndustrialRepository } from '../../sub-sectores-industriales/infrastructure/repositories/prisma-sub-sector-industrial.repository';
import { ImportCategoriasAnunciantesExcelService } from '../application/services/import-categorias-anunciantes-excel.service';
import { CreateCategoriaAnuncianteUseCase } from '../application/use-cases/create-categoria-anunciante.use-case';
import { DeactivateCategoriaAnuncianteUseCase } from '../application/use-cases/deactivate-categoria-anunciante.use-case';
import { GetCategoriaAnuncianteByIdUseCase } from '../application/use-cases/get-categoria-anunciante-by-id.use-case';
import { GetCategoriasAnunciantesUseCase } from '../application/use-cases/get-categorias-anunciantes.use-case';
import { UpdateCategoriaAnuncianteUseCase } from '../application/use-cases/update-categoria-anunciante.use-case';
import { PrismaCategoriaAnuncianteRepository } from '../infrastructure/repositories/prisma-categoria-anunciante.repository';
import { CategoriasAnunciantesController } from './controllers/categorias-anunciantes.controller';

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

export function buildCategoriasAnunciantesRouter(): Router {
  const categoriaRepository = new PrismaCategoriaAnuncianteRepository(prisma);
  const sectorRepository = new PrismaSectorIndustrialRepository(prisma);
  const subSectorRepository = new PrismaSubSectorIndustrialRepository(prisma);
  const getCategoriasAnunciantes = new GetCategoriasAnunciantesUseCase(categoriaRepository);
  const getCategoriaAnuncianteById = new GetCategoriaAnuncianteByIdUseCase(categoriaRepository);
  const createCategoriaAnunciante = new CreateCategoriaAnuncianteUseCase(
    categoriaRepository,
    sectorRepository,
    subSectorRepository,
  );
  const updateCategoriaAnunciante = new UpdateCategoriaAnuncianteUseCase(
    categoriaRepository,
    sectorRepository,
    subSectorRepository,
  );
  const deactivateCategoriaAnunciante = new DeactivateCategoriaAnuncianteUseCase(categoriaRepository);
  const importCategoriasAnunciantesExcel = new ImportCategoriasAnunciantesExcelService(
    categoriaRepository,
    sectorRepository,
    subSectorRepository,
  );
  const uploadService = new HttpUploadServiceClient({
    baseUrl: env.uploadService.baseUrl,
    apiKey: env.uploadService.apiKey,
    apiKeyHeader: env.uploadService.apiKeyHeader,
  });

  const controller = new CategoriasAnunciantesController(
    getCategoriasAnunciantes,
    getCategoriaAnuncianteById,
    createCategoriaAnunciante,
    updateCategoriaAnunciante,
    deactivateCategoriaAnunciante,
    uploadService,
    importCategoriasAnunciantesExcel,
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