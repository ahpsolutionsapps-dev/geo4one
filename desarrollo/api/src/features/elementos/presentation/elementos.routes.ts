import { Router } from 'express';
import { prisma } from '../../../core/database/prisma';
import { asyncHandler } from '../../../core/http/async-handler';
import { JwtTokenService } from '../../auth/infrastructure/services/jwt-token.service';
import { authMiddleware } from '../../auth/presentation/middlewares/auth.middleware';
import { env } from '../../../core/config/env';
import { AnularElementoUseCase } from '../application/use-cases/anular-elemento.use-case';
import { CreateElementoUseCase } from '../application/use-cases/create-elemento.use-case';
import { GetElementoByIdUseCase } from '../application/use-cases/get-elemento-by-id.use-case';
import { GetElementosUseCase } from '../application/use-cases/get-elementos.use-case';
import { UpdateElementoUseCase } from '../application/use-cases/update-elemento.use-case';
import { PrismaElementoRepository } from '../infrastructure/repositories/prisma-elemento.repository';
import { ElementosController } from './controllers/elementos.controller';

export function buildElementosRouter(): Router {
  const repository = new PrismaElementoRepository(prisma);

  const getElementos = new GetElementosUseCase(repository);
  const getElementoById = new GetElementoByIdUseCase(repository);
  const createElemento = new CreateElementoUseCase(repository);
  const updateElemento = new UpdateElementoUseCase(repository);
  const anularElemento = new AnularElementoUseCase(repository);

  const controller = new ElementosController(
    getElementos,
    getElementoById,
    createElemento,
    updateElemento,
    anularElemento,
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
