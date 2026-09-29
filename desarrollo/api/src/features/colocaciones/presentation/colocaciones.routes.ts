import { Router } from 'express';
import { env } from '../../../core/config/env';
import { prisma } from '../../../core/database/prisma';
import { asyncHandler } from '../../../core/http/async-handler';
import { JwtTokenService } from '../../auth/infrastructure/services/jwt-token.service';
import { authMiddleware } from '../../auth/presentation/middlewares/auth.middleware';
import { CreateColocacionUseCase } from '../application/use-cases/create-colocacion.use-case';
import { DeactivateColocacionUseCase } from '../application/use-cases/deactivate-colocacion.use-case';
import { GetColocacionByIdUseCase } from '../application/use-cases/get-colocacion-by-id.use-case';
import { GetColocacionesUseCase } from '../application/use-cases/get-colocaciones.use-case';
import { GetElementosOptionsUseCase } from '../application/use-cases/get-elementos-options.use-case';
import { GetPeriodosOptionsUseCase } from '../application/use-cases/get-periodos-options.use-case';
import { GetVersionesCampanaOptionsUseCase } from '../application/use-cases/get-versiones-campana-options.use-case';
import { UpdateColocacionUseCase } from '../application/use-cases/update-colocacion.use-case';
import { PrismaColocacionRepository } from '../infrastructure/repositories/prisma-colocacion.repository';
import { ColocacionesController } from './controllers/colocaciones.controller';

export function buildColocacionesRouter(): Router {
  const repository = new PrismaColocacionRepository(prisma);
  const getColocaciones = new GetColocacionesUseCase(repository);
  const getColocacionById = new GetColocacionByIdUseCase(repository);
  const getElementosOptions = new GetElementosOptionsUseCase(repository);
  const getVersionesCampanaOptions = new GetVersionesCampanaOptionsUseCase(repository);
  const getPeriodosOptions = new GetPeriodosOptionsUseCase(repository);
  const createColocacion = new CreateColocacionUseCase(repository);
  const updateColocacion = new UpdateColocacionUseCase(repository);
  const deactivateColocacion = new DeactivateColocacionUseCase(repository);

  const controller = new ColocacionesController(
    getColocaciones,
    getColocacionById,
    getElementosOptions,
    getVersionesCampanaOptions,
    getPeriodosOptions,
    createColocacion,
    updateColocacion,
    deactivateColocacion,
  );

  const tokenService = new JwtTokenService(env.jwt.secret, env.jwt.expiresIn);
  const requireAuth = authMiddleware(tokenService);

  const router = Router();
  router.get('/', requireAuth, asyncHandler(controller.list));
  router.get('/options/elementos', requireAuth, asyncHandler(controller.listElementosOptions));
  router.get(
    '/options/versiones-campanas',
    requireAuth,
    asyncHandler(controller.listVersionesCampanaOptions),
  );
  router.get('/options/periodos-colocacion', requireAuth, asyncHandler(controller.listPeriodosOptions));
  router.get('/:id', requireAuth, asyncHandler(controller.getById));
  router.post('/', requireAuth, asyncHandler(controller.create));
  router.patch('/:id', requireAuth, asyncHandler(controller.update));
  router.delete('/:id', requireAuth, asyncHandler(controller.remove));
  return router;
}
