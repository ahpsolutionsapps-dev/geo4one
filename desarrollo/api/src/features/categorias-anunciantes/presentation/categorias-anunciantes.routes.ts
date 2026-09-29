import { Router } from 'express';
import { env } from '../../../core/config/env';
import { prisma } from '../../../core/database/prisma';
import { asyncHandler } from '../../../core/http/async-handler';
import { JwtTokenService } from '../../auth/infrastructure/services/jwt-token.service';
import { authMiddleware } from '../../auth/presentation/middlewares/auth.middleware';
import { PrismaSectorIndustrialRepository } from '../../sectores-industriales/infrastructure/repositories/prisma-sector-industrial.repository';
import { PrismaSubSectorIndustrialRepository } from '../../sub-sectores-industriales/infrastructure/repositories/prisma-sub-sector-industrial.repository';
import { CreateCategoriaAnuncianteUseCase } from '../application/use-cases/create-categoria-anunciante.use-case';
import { DeactivateCategoriaAnuncianteUseCase } from '../application/use-cases/deactivate-categoria-anunciante.use-case';
import { GetCategoriaAnuncianteByIdUseCase } from '../application/use-cases/get-categoria-anunciante-by-id.use-case';
import { GetCategoriasAnunciantesUseCase } from '../application/use-cases/get-categorias-anunciantes.use-case';
import { UpdateCategoriaAnuncianteUseCase } from '../application/use-cases/update-categoria-anunciante.use-case';
import { PrismaCategoriaAnuncianteRepository } from '../infrastructure/repositories/prisma-categoria-anunciante.repository';
import { CategoriasAnunciantesController } from './controllers/categorias-anunciantes.controller';

export function buildCategoriasAnunciantesRouter(): Router {
  const categoriaRepository = new PrismaCategoriaAnuncianteRepository(prisma);
  const sectorRepository = new PrismaSectorIndustrialRepository(prisma);
  const subSectorRepository = new PrismaSubSectorIndustrialRepository(prisma);
  const getCategoriasAnunciantes = new GetCategoriasAnunciantesUseCase(categoriaRepository);
  const getCategoriaAnuncianteById = new GetCategoriaAnuncianteByIdUseCase(categoriaRepository);
  const createCategoriaAnunciante = new CreateCategoriaAnuncianteUseCase(
    categoriaRepository,
    sectorRepository,
    subSectorRepository,
  );
  const updateCategoriaAnunciante = new UpdateCategoriaAnuncianteUseCase(
    categoriaRepository,
    sectorRepository,
    subSectorRepository,
  );
  const deactivateCategoriaAnunciante = new DeactivateCategoriaAnuncianteUseCase(categoriaRepository);

  const controller = new CategoriasAnunciantesController(
    getCategoriasAnunciantes,
    getCategoriaAnuncianteById,
    createCategoriaAnunciante,
    updateCategoriaAnunciante,
    deactivateCategoriaAnunciante,
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