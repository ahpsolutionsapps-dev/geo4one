import multer from 'multer';
import { Router } from 'express';
import { env } from '../../../core/config/env';
import { prisma } from '../../../core/database/prisma';
import { asyncHandler } from '../../../core/http/async-handler';
import { HttpUploadServiceClient } from '../../../shared/infrastructure/upload-service/upload-service.client';
import { JwtTokenService } from '../../auth/infrastructure/services/jwt-token.service';
import { authMiddleware } from '../../auth/presentation/middlewares/auth.middleware';
import { ImportSectoresExcelService } from '../application/services/import-sectores-excel.service';
import { CreateSectorUseCase } from '../application/use-cases/create-sector.use-case';
import { DeactivateSectorUseCase } from '../application/use-cases/deactivate-sector.use-case';
import { GetSectorByIdUseCase } from '../application/use-cases/get-sector-by-id.use-case';
import { GetSectoresUseCase } from '../application/use-cases/get-sectores.use-case';
import { UpdateSectorUseCase } from '../application/use-cases/update-sector.use-case';
import { PrismaMunicipioRepository } from '../../municipios/infrastructure/repositories/prisma-municipio.repository';
import { PrismaSectorRepository } from '../infrastructure/repositories/prisma-sector.repository';
import { SectoresController } from './controllers/sectores.controller';

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

export function buildSectoresRouter(): Router {
  const sectorRepository = new PrismaSectorRepository(prisma);
  const municipioRepository = new PrismaMunicipioRepository(prisma);
  const getSectores = new GetSectoresUseCase(sectorRepository);
  const getSectorById = new GetSectorByIdUseCase(sectorRepository);
  const createSector = new CreateSectorUseCase(
    sectorRepository,
    municipioRepository,
  );
  const updateSector = new UpdateSectorUseCase(
    sectorRepository,
    municipioRepository,
  );
  const deactivateSector = new DeactivateSectorUseCase(sectorRepository);
  const importSectoresExcel = new ImportSectoresExcelService(
    sectorRepository,
    municipioRepository,
  );
  const uploadService = new HttpUploadServiceClient({
    baseUrl: env.uploadService.baseUrl,
    apiKey: env.uploadService.apiKey,
    apiKeyHeader: env.uploadService.apiKeyHeader,
  });

  const controller = new SectoresController(
    getSectores,
    getSectorById,
    createSector,
    updateSector,
    deactivateSector,
    uploadService,
    importSectoresExcel,
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
