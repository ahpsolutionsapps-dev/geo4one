import { Router } from 'express';
import { env } from '../../../core/config/env';
import { prisma } from '../../../core/database/prisma';
import { asyncHandler } from '../../../core/http/async-handler';
import { JwtTokenService } from '../../auth/infrastructure/services/jwt-token.service';
import { authMiddleware } from '../../auth/presentation/middlewares/auth.middleware';
import { CreateSectorIndustrialUseCase } from '../application/use-cases/create-sector-industrial.use-case';
import { DeactivateSectorIndustrialUseCase } from '../application/use-cases/deactivate-sector-industrial.use-case';
import { GetSectorIndustrialByIdUseCase } from '../application/use-cases/get-sector-industrial-by-id.use-case';
import { GetSectoresIndustrialesUseCase } from '../application/use-cases/get-sectores-industriales.use-case';
import { UpdateSectorIndustrialUseCase } from '../application/use-cases/update-sector-industrial.use-case';
import { PrismaSectorIndustrialRepository } from '../infrastructure/repositories/prisma-sector-industrial.repository';
import { SectoresIndustrialesController } from './controllers/sectores-industriales.controller';

export function buildSectoresIndustrialesRouter(): Router {
  const repository = new PrismaSectorIndustrialRepository(prisma);
  const getSectoresIndustriales = new GetSectoresIndustrialesUseCase(repository);
  const getSectorIndustrialById = new GetSectorIndustrialByIdUseCase(repository);
  const createSectorIndustrial = new CreateSectorIndustrialUseCase(repository);
  const updateSectorIndustrial = new UpdateSectorIndustrialUseCase(repository);
  const deactivateSectorIndustrial = new DeactivateSectorIndustrialUseCase(repository);

  const controller = new SectoresIndustrialesController(
    getSectoresIndustriales,
    getSectorIndustrialById,
    createSectorIndustrial,
    updateSectorIndustrial,
    deactivateSectorIndustrial,
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