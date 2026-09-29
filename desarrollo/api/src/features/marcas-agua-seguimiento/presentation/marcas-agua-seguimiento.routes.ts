import { Router } from 'express';
import { env } from '../../../core/config/env';
import { prisma } from '../../../core/database/prisma';
import { asyncHandler } from '../../../core/http/async-handler';
import { JwtTokenService } from '../../auth/infrastructure/services/jwt-token.service';
import { authMiddleware } from '../../auth/presentation/middlewares/auth.middleware';
import { CreateMarcaAguaSeguimientoUseCase } from '../application/use-cases/create-marca-agua-seguimiento.use-case';
import { DeactivateMarcaAguaSeguimientoUseCase } from '../application/use-cases/deactivate-marca-agua-seguimiento.use-case';
import { GetMarcaAguaSeguimientoByIdUseCase } from '../application/use-cases/get-marca-agua-seguimiento-by-id.use-case';
import { GetMarcasAguaSeguimientoUseCase } from '../application/use-cases/get-marcas-agua-seguimiento.use-case';
import { GetVersionesCampanaOptionsUseCase } from '../application/use-cases/get-versiones-campana-options.use-case';
import { UpdateMarcaAguaSeguimientoUseCase } from '../application/use-cases/update-marca-agua-seguimiento.use-case';
import { PrismaMarcaAguaSeguimientoRepository } from '../infrastructure/repositories/prisma-marca-agua-seguimiento.repository';
import { MarcasAguaSeguimientoController } from './controllers/marcas-agua-seguimiento.controller';

export function buildMarcasAguaSeguimientoRouter(): Router {
  const repository = new PrismaMarcaAguaSeguimientoRepository(prisma);
  const getMarcasAguaSeguimiento = new GetMarcasAguaSeguimientoUseCase(repository);
  const getMarcaAguaSeguimientoById = new GetMarcaAguaSeguimientoByIdUseCase(repository);
  const getVersionesCampanaOptions = new GetVersionesCampanaOptionsUseCase(repository);
  const createMarcaAguaSeguimiento = new CreateMarcaAguaSeguimientoUseCase(repository);
  const updateMarcaAguaSeguimiento = new UpdateMarcaAguaSeguimientoUseCase(repository);
  const deactivateMarcaAguaSeguimiento = new DeactivateMarcaAguaSeguimientoUseCase(repository);

  const controller = new MarcasAguaSeguimientoController(
    getMarcasAguaSeguimiento,
    getMarcaAguaSeguimientoById,
    getVersionesCampanaOptions,
    createMarcaAguaSeguimiento,
    updateMarcaAguaSeguimiento,
    deactivateMarcaAguaSeguimiento,
  );

  const tokenService = new JwtTokenService(env.jwt.secret, env.jwt.expiresIn);
  const requireAuth = authMiddleware(tokenService);

  const router = Router();
  router.get('/', requireAuth, asyncHandler(controller.list));
  router.get('/options/versiones-campanas', requireAuth, asyncHandler(controller.listVersionesOptions));
  router.get('/:id', requireAuth, asyncHandler(controller.getById));
  router.post('/', requireAuth, asyncHandler(controller.create));
  router.patch('/:id', requireAuth, asyncHandler(controller.update));
  router.delete('/:id', requireAuth, asyncHandler(controller.remove));
  return router;
}
