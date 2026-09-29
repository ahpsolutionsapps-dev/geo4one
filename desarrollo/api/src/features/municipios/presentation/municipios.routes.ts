import multer from 'multer';
import { Router } from 'express';
import { env } from '../../../core/config/env';
import { prisma } from '../../../core/database/prisma';
import { asyncHandler } from '../../../core/http/async-handler';
import { HttpUploadServiceClient } from '../../../shared/infrastructure/upload-service/upload-service.client';
import { JwtTokenService } from '../../auth/infrastructure/services/jwt-token.service';
import { authMiddleware } from '../../auth/presentation/middlewares/auth.middleware';
import { ImportMunicipiosExcelService } from '../application/services/import-municipios-excel.service';
import { CreateMunicipioUseCase } from '../application/use-cases/create-municipio.use-case';
import { DeactivateMunicipioUseCase } from '../application/use-cases/deactivate-municipio.use-case';
import { GetMunicipioByIdUseCase } from '../application/use-cases/get-municipio-by-id.use-case';
import { GetMunicipiosUseCase } from '../application/use-cases/get-municipios.use-case';
import { UpdateMunicipioUseCase } from '../application/use-cases/update-municipio.use-case';
import { PrismaMunicipioRepository } from '../infrastructure/repositories/prisma-municipio.repository';
import { PrismaProvinciaRepository } from '../../provincias/infrastructure/repositories/prisma-provincia.repository';
import { MunicipiosController } from './controllers/municipios.controller';

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

export function buildMunicipiosRouter(): Router {
  const municipioRepository = new PrismaMunicipioRepository(prisma);
  const provinciaRepository = new PrismaProvinciaRepository(prisma);
  const getMunicipios = new GetMunicipiosUseCase(municipioRepository);
  const getMunicipioById = new GetMunicipioByIdUseCase(municipioRepository);
  const createMunicipio = new CreateMunicipioUseCase(
    municipioRepository,
    provinciaRepository,
  );
  const updateMunicipio = new UpdateMunicipioUseCase(
    municipioRepository,
    provinciaRepository,
  );
  const deactivateMunicipio = new DeactivateMunicipioUseCase(municipioRepository);
  const importMunicipiosExcel = new ImportMunicipiosExcelService(
    municipioRepository,
    provinciaRepository,
  );
  const uploadService = new HttpUploadServiceClient({
    baseUrl: env.uploadService.baseUrl,
    apiKey: env.uploadService.apiKey,
    apiKeyHeader: env.uploadService.apiKeyHeader,
  });

  const controller = new MunicipiosController(
    getMunicipios,
    getMunicipioById,
    createMunicipio,
    updateMunicipio,
    deactivateMunicipio,
    uploadService,
    importMunicipiosExcel,
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
