import multer from 'multer';
import { Router } from 'express';
import { env } from '../../../core/config/env';
import { prisma } from '../../../core/database/prisma';
import { asyncHandler } from '../../../core/http/async-handler';
import { HttpUploadServiceClient } from '../../../shared/infrastructure/upload-service/upload-service.client';
import { JwtTokenService } from '../../auth/infrastructure/services/jwt-token.service';
import { authMiddleware } from '../../auth/presentation/middlewares/auth.middleware';
import { ImportSectoresIndustrialesExcelService } from '../application/services/import-sectores-industriales-excel.service';
import { CreateSectorIndustrialUseCase } from '../application/use-cases/create-sector-industrial.use-case';
import { DeactivateSectorIndustrialUseCase } from '../application/use-cases/deactivate-sector-industrial.use-case';
import { GetSectorIndustrialByIdUseCase } from '../application/use-cases/get-sector-industrial-by-id.use-case';
import { GetSectoresIndustrialesUseCase } from '../application/use-cases/get-sectores-industriales.use-case';
import { UpdateSectorIndustrialUseCase } from '../application/use-cases/update-sector-industrial.use-case';
import { PrismaSectorIndustrialRepository } from '../infrastructure/repositories/prisma-sector-industrial.repository';
import { SectoresIndustrialesController } from './controllers/sectores-industriales.controller';

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

export function buildSectoresIndustrialesRouter(): Router {
  const repository = new PrismaSectorIndustrialRepository(prisma);
  const getSectoresIndustriales = new GetSectoresIndustrialesUseCase(repository);
  const getSectorIndustrialById = new GetSectorIndustrialByIdUseCase(repository);
  const createSectorIndustrial = new CreateSectorIndustrialUseCase(repository);
  const updateSectorIndustrial = new UpdateSectorIndustrialUseCase(repository);
  const deactivateSectorIndustrial = new DeactivateSectorIndustrialUseCase(repository);
  const importSectoresIndustrialesExcel = new ImportSectoresIndustrialesExcelService(repository);
  const uploadService = new HttpUploadServiceClient({
    baseUrl: env.uploadService.baseUrl,
    apiKey: env.uploadService.apiKey,
    apiKeyHeader: env.uploadService.apiKeyHeader,
  });

  const controller = new SectoresIndustrialesController(
    getSectoresIndustriales,
    getSectorIndustrialById,
    createSectorIndustrial,
    updateSectorIndustrial,
    deactivateSectorIndustrial,
    uploadService,
    importSectoresIndustrialesExcel,
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