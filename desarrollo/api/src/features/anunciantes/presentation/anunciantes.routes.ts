import multer from 'multer';
import { Router } from 'express';
import { env } from '../../../core/config/env';
import { prisma } from '../../../core/database/prisma';
import { asyncHandler } from '../../../core/http/async-handler';
import { HttpUploadServiceClient } from '../../../shared/infrastructure/upload-service/upload-service.client';
import { JwtTokenService } from '../../auth/infrastructure/services/jwt-token.service';
import { authMiddleware } from '../../auth/presentation/middlewares/auth.middleware';
import { ImportAnunciantesExcelService } from '../application/services/import-anunciantes-excel.service';
import { CreateAnuncianteUseCase } from '../application/use-cases/create-anunciante.use-case';
import { DeactivateAnuncianteUseCase } from '../application/use-cases/deactivate-anunciante.use-case';
import { GetAnuncianteByIdUseCase } from '../application/use-cases/get-anunciante-by-id.use-case';
import { GetAnunciantesUseCase } from '../application/use-cases/get-anunciantes.use-case';
import { GetCategoriasAnunciantesOptionsUseCase } from '../application/use-cases/get-categorias-anunciantes-options.use-case';
import { GetSectoresIndustrialesOptionsUseCase } from '../application/use-cases/get-sectores-industriales-options.use-case';
import { GetSubSectoresIndustrialesOptionsUseCase } from '../application/use-cases/get-sub-sectores-industriales-options.use-case';
import { UpdateAnuncianteUseCase } from '../application/use-cases/update-anunciante.use-case';
import { PrismaAnuncianteRepository } from '../infrastructure/repositories/prisma-anunciante.repository';
import { AnunciantesController } from './controllers/anunciantes.controller';

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

export function buildAnunciantesRouter(): Router {
  const repository = new PrismaAnuncianteRepository(prisma);
  const getAnunciantes = new GetAnunciantesUseCase(repository);
  const getAnuncianteById = new GetAnuncianteByIdUseCase(repository);
  const getSectoresOptions = new GetSectoresIndustrialesOptionsUseCase(repository);
  const getSubSectoresOptions = new GetSubSectoresIndustrialesOptionsUseCase(repository);
  const getCategoriasOptions = new GetCategoriasAnunciantesOptionsUseCase(repository);
  const createAnunciante = new CreateAnuncianteUseCase(repository);
  const updateAnunciante = new UpdateAnuncianteUseCase(repository);
  const deactivateAnunciante = new DeactivateAnuncianteUseCase(repository);
  const importAnunciantesExcel = new ImportAnunciantesExcelService(repository);
  const uploadService = new HttpUploadServiceClient({
    baseUrl: env.uploadService.baseUrl,
    apiKey: env.uploadService.apiKey,
    apiKeyHeader: env.uploadService.apiKeyHeader,
  });

  const controller = new AnunciantesController(
    getAnunciantes,
    getAnuncianteById,
    getSectoresOptions,
    getSubSectoresOptions,
    getCategoriasOptions,
    createAnunciante,
    updateAnunciante,
    deactivateAnunciante,
    uploadService,
    importAnunciantesExcel,
  );

  const tokenService = new JwtTokenService(env.jwt.secret, env.jwt.expiresIn);
  const requireAuth = authMiddleware(tokenService);

  const router = Router();
  router.post('/importar-excel', requireAuth, excelUploadMiddleware, asyncHandler(controller.importExcel));
  router.get('/', requireAuth, asyncHandler(controller.list));
  router.get('/options/sectores-industriales', requireAuth, asyncHandler(controller.listSectoresOptions));
  router.get('/options/sub-sectores-industriales', requireAuth, asyncHandler(controller.listSubSectoresOptions));
  router.get('/options/categorias-anunciantes', requireAuth, asyncHandler(controller.listCategoriasOptions));
  router.get('/:id', requireAuth, asyncHandler(controller.getById));
  router.post('/', requireAuth, asyncHandler(controller.create));
  router.patch('/:id', requireAuth, asyncHandler(controller.update));
  router.delete('/:id', requireAuth, asyncHandler(controller.remove));
  return router;
}
