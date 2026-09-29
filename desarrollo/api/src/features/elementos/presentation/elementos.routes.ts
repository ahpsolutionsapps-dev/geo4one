import multer from 'multer';
import { Router } from 'express';
import { prisma } from '../../../core/database/prisma';
import { asyncHandler } from '../../../core/http/async-handler';
import { JwtTokenService } from '../../auth/infrastructure/services/jwt-token.service';
import { authMiddleware } from '../../auth/presentation/middlewares/auth.middleware';
import { env } from '../../../core/config/env';
import { HttpUploadServiceClient } from '../../../shared/infrastructure/upload-service/upload-service.client';
import { ImportCatalogosElementosExcelService } from '../application/services/import-catalogos-elementos-excel.service';
import { ImportElementosExcelService } from '../application/services/import-elementos-excel.service';
import { AnularElementoUseCase } from '../application/use-cases/anular-elemento.use-case';
import { CreateElementoUseCase } from '../application/use-cases/create-elemento.use-case';
import { GetElementoByIdUseCase } from '../application/use-cases/get-elemento-by-id.use-case';
import { GetElementosUseCase } from '../application/use-cases/get-elementos.use-case';
import { UpdateElementoUseCase } from '../application/use-cases/update-elemento.use-case';
import { PrismaElementoRepository } from '../infrastructure/repositories/prisma-elemento.repository';
import { ElementosController } from './controllers/elementos.controller';
import { PrismaProveedorRepository } from '../../proveedores/infrastructure/repositories/prisma-proveedor.repository';
import { PrismaProvinciaRepository } from '../../provincias/infrastructure/repositories/prisma-provincia.repository';
import { PrismaMunicipioRepository } from '../../municipios/infrastructure/repositories/prisma-municipio.repository';
import { PrismaSectorRepository } from '../../sectores/infrastructure/repositories/prisma-sector.repository';

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

export function buildElementosRouter(): Router {
  const repository = new PrismaElementoRepository(prisma);
  const proveedoresRepository = new PrismaProveedorRepository(prisma);
  const provinciasRepository = new PrismaProvinciaRepository(prisma);
  const municipiosRepository = new PrismaMunicipioRepository(prisma);
  const sectoresRepository = new PrismaSectorRepository(prisma);

  const getElementos = new GetElementosUseCase(repository);
  const getElementoById = new GetElementoByIdUseCase(repository);
  const createElemento = new CreateElementoUseCase(repository);
  const updateElemento = new UpdateElementoUseCase(repository);
  const anularElemento = new AnularElementoUseCase(repository);
  const importCatalogosExcel = new ImportCatalogosElementosExcelService(repository);
  const importElementosExcel = new ImportElementosExcelService(
    repository,
    proveedoresRepository,
    provinciasRepository,
    municipiosRepository,
    sectoresRepository,
  );
  const uploadService = new HttpUploadServiceClient({
    baseUrl: env.uploadService.baseUrl,
    apiKey: env.uploadService.apiKey,
    apiKeyHeader: env.uploadService.apiKeyHeader,
  });

  const controller = new ElementosController(
    getElementos,
    getElementoById,
    createElemento,
    updateElemento,
    anularElemento,
    repository,
    uploadService,
    importCatalogosExcel,
    importElementosExcel,
  );

  const tokenService = new JwtTokenService(env.jwt.secret, env.jwt.expiresIn);
  const requireAuth = authMiddleware(tokenService);

  const router = Router();
  router.post('/catalogos/tipos-elementos/importar-excel', requireAuth, excelUploadMiddleware, asyncHandler(controller.importTiposElementosExcel));
  router.get('/catalogos/tipos-elementos', requireAuth, asyncHandler(controller.listTiposElementos));
  router.post('/catalogos/tipos-elementos', requireAuth, asyncHandler(controller.createTipoElemento));
  router.patch('/catalogos/tipos-elementos/:id', requireAuth, asyncHandler(controller.updateTipoElemento));
  router.delete('/catalogos/tipos-elementos/:id', requireAuth, asyncHandler(controller.removeTipoElemento));

  router.post('/catalogos/orientaciones/importar-excel', requireAuth, excelUploadMiddleware, asyncHandler(controller.importOrientacionesExcel));
  router.get('/catalogos/orientaciones', requireAuth, asyncHandler(controller.listOrientaciones));
  router.post('/catalogos/orientaciones', requireAuth, asyncHandler(controller.createOrientacion));
  router.patch('/catalogos/orientaciones/:id', requireAuth, asyncHandler(controller.updateOrientacion));
  router.delete('/catalogos/orientaciones/:id', requireAuth, asyncHandler(controller.removeOrientacion));

  router.post('/catalogos/dimensiones/importar-excel', requireAuth, excelUploadMiddleware, asyncHandler(controller.importDimensionesExcel));
  router.get('/catalogos/dimensiones', requireAuth, asyncHandler(controller.listDimensiones));
  router.post('/catalogos/dimensiones', requireAuth, asyncHandler(controller.createDimension));
  router.patch('/catalogos/dimensiones/:id', requireAuth, asyncHandler(controller.updateDimension));
  router.delete('/catalogos/dimensiones/:id', requireAuth, asyncHandler(controller.removeDimension));

  router.post('/catalogos/tipos-formatos/importar-excel', requireAuth, excelUploadMiddleware, asyncHandler(controller.importFormatosExcel));
  router.get('/catalogos/tipos-formatos', requireAuth, asyncHandler(controller.listFormatos));
  router.post('/catalogos/tipos-formatos', requireAuth, asyncHandler(controller.createFormato));
  router.patch('/catalogos/tipos-formatos/:id', requireAuth, asyncHandler(controller.updateFormato));
  router.delete('/catalogos/tipos-formatos/:id', requireAuth, asyncHandler(controller.removeFormato));

  router.post('/importar-excel', requireAuth, excelUploadMiddleware, asyncHandler(controller.importElementosExcel));
  router.get('/', requireAuth, asyncHandler(controller.list));
  router.get('/:id', requireAuth, asyncHandler(controller.getById));
  router.post('/', requireAuth, asyncHandler(controller.create));
  router.patch('/:id', requireAuth, asyncHandler(controller.update));
  router.delete('/:id', requireAuth, asyncHandler(controller.remove));

  return router;
}
