import { Router } from 'express';
import { env } from '../../../core/config/env';
import { prisma } from '../../../core/database/prisma';
import { asyncHandler } from '../../../core/http/async-handler';
import { JwtTokenService } from '../../auth/infrastructure/services/jwt-token.service';
import { authMiddleware } from '../../auth/presentation/middlewares/auth.middleware';
import { CreateComboAnuncianteUseCase } from '../application/use-cases/create-combo-anunciante.use-case';
import { DeactivateComboAnuncianteUseCase } from '../application/use-cases/deactivate-combo-anunciante.use-case';
import { GetComboAnuncianteByIdUseCase } from '../application/use-cases/get-combo-anunciante-by-id.use-case';
import { GetComboMarcasOptionsUseCase } from '../application/use-cases/get-combo-marcas-options.use-case';
import { GetCombosAnunciantesUseCase } from '../application/use-cases/get-combos-anunciantes.use-case';
import { UpdateComboAnuncianteUseCase } from '../application/use-cases/update-combo-anunciante.use-case';
import { PrismaComboAnuncianteRepository } from '../infrastructure/repositories/prisma-combo-anunciante.repository';
import { CombosAnunciantesController } from './controllers/combos-anunciantes.controller';

export function buildCombosAnunciantesRouter(): Router {
  const repository = new PrismaComboAnuncianteRepository(prisma);
  const getCombosAnunciantes = new GetCombosAnunciantesUseCase(repository);
  const getComboAnuncianteById = new GetComboAnuncianteByIdUseCase(repository);
  const getComboMarcasOptions = new GetComboMarcasOptionsUseCase(repository);
  const createComboAnunciante = new CreateComboAnuncianteUseCase(repository);
  const updateComboAnunciante = new UpdateComboAnuncianteUseCase(repository);
  const deactivateComboAnunciante = new DeactivateComboAnuncianteUseCase(repository);

  const controller = new CombosAnunciantesController(
    getCombosAnunciantes,
    getComboAnuncianteById,
    getComboMarcasOptions,
    createComboAnunciante,
    updateComboAnunciante,
    deactivateComboAnunciante,
  );

  const tokenService = new JwtTokenService(env.jwt.secret, env.jwt.expiresIn);
  const requireAuth = authMiddleware(tokenService);

  const router = Router();
  router.get('/', requireAuth, asyncHandler(controller.list));
  router.get('/options/marcas-productos', requireAuth, asyncHandler(controller.listMarcasOptions));
  router.get('/:id', requireAuth, asyncHandler(controller.getById));
  router.post('/', requireAuth, asyncHandler(controller.create));
  router.patch('/:id', requireAuth, asyncHandler(controller.update));
  router.delete('/:id', requireAuth, asyncHandler(controller.remove));
  return router;
}
