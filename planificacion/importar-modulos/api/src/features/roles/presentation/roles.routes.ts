import { Router } from 'express';
import { env } from '../../../core/config/env';
import { prisma } from '../../../core/database/prisma';
import { asyncHandler } from '../../../core/http/async-handler';
import { PrismaModuloRepository } from '../../auth/infrastructure/repositories/prisma-modulo.repository';
import { JwtTokenService } from '../../auth/infrastructure/services/jwt-token.service';
import { authMiddleware } from '../../auth/presentation/middlewares/auth.middleware';
import { AnularRolUseCase } from '../application/use-cases/anular-rol.use-case';
import { CreateRolUseCase } from '../application/use-cases/create-rol.use-case';
import { GetModulosCatalogUseCase } from '../application/use-cases/get-modulos-catalog.use-case';
import { GetRolByIdUseCase } from '../application/use-cases/get-rol-by-id.use-case';
import { GetRolesUseCase } from '../application/use-cases/get-roles.use-case';
import { UpdateRolUseCase } from '../application/use-cases/update-rol.use-case';
import { PrismaRolRepository } from '../infrastructure/repositories/prisma-rol.repository';
import { RolesController } from './controllers/roles.controller';

export function buildRolesRouter(): Router {
  const repository = new PrismaRolRepository(prisma);
  const moduloRepository = new PrismaModuloRepository(prisma);

  const getRoles = new GetRolesUseCase(repository);
  const getRolById = new GetRolByIdUseCase(repository, moduloRepository);
  const createRol = new CreateRolUseCase(repository, moduloRepository);
  const updateRol = new UpdateRolUseCase(repository, moduloRepository);
  const anularRol = new AnularRolUseCase(repository);
  const getModulosCatalog = new GetModulosCatalogUseCase(moduloRepository);

  const controller = new RolesController(
    getRoles,
    getRolById,
    createRol,
    updateRol,
    anularRol,
    getModulosCatalog,
  );

  const tokenService = new JwtTokenService(env.jwt.secret, env.jwt.expiresIn);
  const requireAuth = authMiddleware(tokenService);

  const router = Router();
  router.get('/', requireAuth, asyncHandler(controller.list));
  router.get('/modulos', requireAuth, asyncHandler(controller.listModulos));
  router.get('/:id', requireAuth, asyncHandler(controller.getById));
  router.post('/', requireAuth, asyncHandler(controller.create));
  router.patch('/:id', requireAuth, asyncHandler(controller.update));
  router.put('/:id/modulos', requireAuth, asyncHandler(controller.replaceModulos));
  router.delete('/:id', requireAuth, asyncHandler(controller.remove));
  return router;
}
