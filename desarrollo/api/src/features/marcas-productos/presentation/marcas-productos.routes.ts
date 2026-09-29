import { Router } from 'express';
import { env } from '../../../core/config/env';
import { prisma } from '../../../core/database/prisma';
import { asyncHandler } from '../../../core/http/async-handler';
import { JwtTokenService } from '../../auth/infrastructure/services/jwt-token.service';
import { authMiddleware } from '../../auth/presentation/middlewares/auth.middleware';
import { PrismaMarcaProductoRepository } from '../infrastructure/repositories/prisma-marca-producto.repository';
import { CreateMarcaProductoUseCase } from '../application/use-cases/create-marca-producto.use-case';
import { DeactivateMarcaProductoUseCase } from '../application/use-cases/deactivate-marca-producto.use-case';
import { GetMarcaProductoByIdUseCase } from '../application/use-cases/get-marca-producto-by-id.use-case';
import { GetMarcasProductosUseCase } from '../application/use-cases/get-marcas-productos.use-case';
import { UpdateMarcaProductoUseCase } from '../application/use-cases/update-marca-producto.use-case';
import { MarcasProductosController } from './controllers/marcas-productos.controller';

export function buildMarcasProductosRouter(): Router {
  const repository = new PrismaMarcaProductoRepository(prisma);
  const getMarcasProductos = new GetMarcasProductosUseCase(repository);
  const getMarcaProductoById = new GetMarcaProductoByIdUseCase(repository);
  const createMarcaProducto = new CreateMarcaProductoUseCase(repository);
  const updateMarcaProducto = new UpdateMarcaProductoUseCase(repository);
  const deactivateMarcaProducto = new DeactivateMarcaProductoUseCase(repository);

  const controller = new MarcasProductosController(
    getMarcasProductos,
    getMarcaProductoById,
    createMarcaProducto,
    updateMarcaProducto,
    deactivateMarcaProducto,
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