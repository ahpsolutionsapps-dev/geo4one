import { Router } from 'express';
import { env } from '../../../core/config/env';
import { prisma } from '../../../core/database/prisma';
import { asyncHandler } from '../../../core/http/async-handler';
import { JwtTokenService } from '../../auth/infrastructure/services/jwt-token.service';
import { authMiddleware } from '../../auth/presentation/middlewares/auth.middleware';
import { PrismaSectorIndustrialRepository } from '../../sectores-industriales/infrastructure/repositories/prisma-sector-industrial.repository';
import { CreateSubSectorIndustrialUseCase } from '../application/use-cases/create-sub-sector-industrial.use-case';
import { DeactivateSubSectorIndustrialUseCase } from '../application/use-cases/deactivate-sub-sector-industrial.use-case';
import { GetSubSectorIndustrialByIdUseCase } from '../application/use-cases/get-sub-sector-industrial-by-id.use-case';
import { GetSubSectoresIndustrialesUseCase } from '../application/use-cases/get-sub-sectores-industriales.use-case';
import { UpdateSubSectorIndustrialUseCase } from '../application/use-cases/update-sub-sector-industrial.use-case';
import { PrismaSubSectorIndustrialRepository } from '../infrastructure/repositories/prisma-sub-sector-industrial.repository';
import { SubSectoresIndustrialesController } from './controllers/sub-sectores-industriales.controller';

export function buildSubSectoresIndustrialesRouter(): Router {
  const subSectorRepository = new PrismaSubSectorIndustrialRepository(prisma);
  const sectorRepository = new PrismaSectorIndustrialRepository(prisma);
  const getSubSectoresIndustriales = new GetSubSectoresIndustrialesUseCase(subSectorRepository);
  const getSubSectorIndustrialById = new GetSubSectorIndustrialByIdUseCase(subSectorRepository);
  const createSubSectorIndustrial = new CreateSubSectorIndustrialUseCase(
    subSectorRepository,
    sectorRepository,
  );
  const updateSubSectorIndustrial = new UpdateSubSectorIndustrialUseCase(
    subSectorRepository,
    sectorRepository,
  );
  const deactivateSubSectorIndustrial = new DeactivateSubSectorIndustrialUseCase(subSectorRepository);

  const controller = new SubSectoresIndustrialesController(
    getSubSectoresIndustriales,
    getSubSectorIndustrialById,
    createSubSectorIndustrial,
    updateSubSectorIndustrial,
    deactivateSubSectorIndustrial,
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