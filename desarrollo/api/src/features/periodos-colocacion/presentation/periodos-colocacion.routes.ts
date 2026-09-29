import { Router } from 'express';
import { env } from '../../../core/config/env';
import { prisma } from '../../../core/database/prisma';
import { asyncHandler } from '../../../core/http/async-handler';
import { JwtTokenService } from '../../auth/infrastructure/services/jwt-token.service';
import { authMiddleware } from '../../auth/presentation/middlewares/auth.middleware';
import { CreatePeriodoColocacionUseCase } from '../application/use-cases/create-periodo-colocacion.use-case';
import { DeactivatePeriodoColocacionUseCase } from '../application/use-cases/deactivate-periodo-colocacion.use-case';
import { GetPeriodoColocacionByIdUseCase } from '../application/use-cases/get-periodo-colocacion-by-id.use-case';
import { GetPeriodosColocacionUseCase } from '../application/use-cases/get-periodos-colocacion.use-case';
import { UpdatePeriodoColocacionUseCase } from '../application/use-cases/update-periodo-colocacion.use-case';
import { PrismaPeriodoColocacionRepository } from '../infrastructure/repositories/prisma-periodo-colocacion.repository';
import { PeriodosColocacionController } from './controllers/periodos-colocacion.controller';

export function buildPeriodosColocacionRouter(): Router {
  const repository = new PrismaPeriodoColocacionRepository(prisma);
  const getPeriodosColocacion = new GetPeriodosColocacionUseCase(repository);
  const getPeriodoColocacionById = new GetPeriodoColocacionByIdUseCase(repository);
  const createPeriodoColocacion = new CreatePeriodoColocacionUseCase(repository);
  const updatePeriodoColocacion = new UpdatePeriodoColocacionUseCase(repository);
  const deactivatePeriodoColocacion = new DeactivatePeriodoColocacionUseCase(repository);

  const controller = new PeriodosColocacionController(
    getPeriodosColocacion,
    getPeriodoColocacionById,
    createPeriodoColocacion,
    updatePeriodoColocacion,
    deactivatePeriodoColocacion,
  );

  const tokenService = new JwtTokenService(env.jwt.secret, env.jwt.expiresIn);
  const requireAuth = authMiddleware(tokenService);

  const router = Router();
  router.get('/', requireAuth, asyncHandler(controller.list));
  router.get('/:id', requireAuth, asyncHandler(controller.getById));
  router.post('/', requireAuth, asyncHandler(controller.create));
  router.patch('/:id', requireAuth, asyncHandler(controller.update));
  router.delete('/:id', requireAuth, asyncHandler(controller.remove));
  return router;
}
