import { Router } from 'express';
import { env } from '../../../core/config/env';
import { prisma } from '../../../core/database/prisma';
import { asyncHandler } from '../../../core/http/async-handler';
import { JwtTokenService } from '../../auth/infrastructure/services/jwt-token.service';
import { authMiddleware } from '../../auth/presentation/middlewares/auth.middleware';
import { CreateVersionCampanaUseCase } from '../application/use-cases/create-version-campana.use-case';
import { DeactivateVersionCampanaUseCase } from '../application/use-cases/deactivate-version-campana.use-case';
import { GetAnunciantesOptionsUseCase } from '../application/use-cases/get-anunciantes-options.use-case';
import { GetCombosAnunciantesOptionsUseCase } from '../application/use-cases/get-combos-anunciantes-options.use-case';
import { GetMarcasProductosOptionsUseCase } from '../application/use-cases/get-marcas-productos-options.use-case';
import { GetVersionCampanaByIdUseCase } from '../application/use-cases/get-version-campana-by-id.use-case';
import { GetVersionesCampanasUseCase } from '../application/use-cases/get-versiones-campanas.use-case';
import { UpdateVersionCampanaUseCase } from '../application/use-cases/update-version-campana.use-case';
import { PrismaVersionCampanaRepository } from '../infrastructure/repositories/prisma-version-campana.repository';
import { VersionesCampanasController } from './controllers/versiones-campanas.controller';

export function buildVersionesCampanasRouter(): Router {
  const repository = new PrismaVersionCampanaRepository(prisma);
  const getVersionesCampanas = new GetVersionesCampanasUseCase(repository);
  const getVersionCampanaById = new GetVersionCampanaByIdUseCase(repository);
  const getAnunciantesOptions = new GetAnunciantesOptionsUseCase(repository);
  const getMarcasProductosOptions = new GetMarcasProductosOptionsUseCase(repository);
  const getCombosAnunciantesOptions = new GetCombosAnunciantesOptionsUseCase(repository);
  const createVersionCampana = new CreateVersionCampanaUseCase(repository);
  const updateVersionCampana = new UpdateVersionCampanaUseCase(repository);
  const deactivateVersionCampana = new DeactivateVersionCampanaUseCase(repository);

  const controller = new VersionesCampanasController(
    getVersionesCampanas,
    getVersionCampanaById,
    getAnunciantesOptions,
    getMarcasProductosOptions,
    getCombosAnunciantesOptions,
    createVersionCampana,
    updateVersionCampana,
    deactivateVersionCampana,
  );

  const tokenService = new JwtTokenService(env.jwt.secret, env.jwt.expiresIn);
  const requireAuth = authMiddleware(tokenService);

  const router = Router();
  router.get('/', requireAuth, asyncHandler(controller.list));
  router.get('/options/anunciantes', requireAuth, asyncHandler(controller.listAnunciantesOptions));
  router.get(
    '/options/marcas-productos',
    requireAuth,
    asyncHandler(controller.listMarcasProductosOptions),
  );
  router.get(
    '/options/combos-anunciantes',
    requireAuth,
    asyncHandler(controller.listCombosAnunciantesOptions),
  );
  router.get('/:id', requireAuth, asyncHandler(controller.getById));
  router.post('/', requireAuth, asyncHandler(controller.create));
  router.patch('/:id', requireAuth, asyncHandler(controller.update));
  router.delete('/:id', requireAuth, asyncHandler(controller.remove));
  return router;
}
