import { Router } from 'express';
import { env } from '../../../core/config/env';
import { prisma } from '../../../core/database/prisma';
import { asyncHandler } from '../../../core/http/async-handler';
import { JwtTokenService } from '../../auth/infrastructure/services/jwt-token.service';
import { authMiddleware } from '../../auth/presentation/middlewares/auth.middleware';
import { CreateProveedorUseCase } from '../application/use-cases/create-proveedor.use-case';
import { DeactivateProveedorUseCase } from '../application/use-cases/deactivate-proveedor.use-case';
import { GetProveedorByIdUseCase } from '../application/use-cases/get-proveedor-by-id.use-case';
import { GetProveedoresUseCase } from '../application/use-cases/get-proveedores.use-case';
import { UpdateProveedorUseCase } from '../application/use-cases/update-proveedor.use-case';
import { PrismaProveedorRepository } from '../infrastructure/repositories/prisma-proveedor.repository';
import { ProveedoresController } from './controllers/proveedores.controller';
import { PrismaProvinciaRepository } from '../../provincias/infrastructure/repositories/prisma-provincia.repository';
import { PrismaMunicipioRepository } from '../../municipios/infrastructure/repositories/prisma-municipio.repository';
import { PrismaSectorRepository } from '../../sectores/infrastructure/repositories/prisma-sector.repository';

export function buildProveedoresRouter(): Router {
  const proveedorRepository = new PrismaProveedorRepository(prisma);
  const provinciaRepository = new PrismaProvinciaRepository(prisma);
  const municipioRepository = new PrismaMunicipioRepository(prisma);
  const sectorRepository = new PrismaSectorRepository(prisma);

  const getProveedores = new GetProveedoresUseCase(proveedorRepository);
  const getProveedorById = new GetProveedorByIdUseCase(proveedorRepository);
  const createProveedor = new CreateProveedorUseCase(
    proveedorRepository,
    provinciaRepository,
    municipioRepository,
    sectorRepository,
  );
  const updateProveedor = new UpdateProveedorUseCase(
    proveedorRepository,
    provinciaRepository,
    municipioRepository,
    sectorRepository,
  );
  const deactivateProveedor = new DeactivateProveedorUseCase(proveedorRepository);

  const controller = new ProveedoresController(
    getProveedores,
    getProveedorById,
    createProveedor,
    updateProveedor,
    deactivateProveedor,
    proveedorRepository,
  );

  const tokenService = new JwtTokenService(env.jwt.secret, env.jwt.expiresIn);
  const requireAuth = authMiddleware(tokenService);

  const router = Router();
  router.get('/', requireAuth, asyncHandler(controller.list));
  router.get('/:id', requireAuth, asyncHandler(controller.getById));
  router.post('/', requireAuth, asyncHandler(controller.create));
  router.patch('/:id', requireAuth, asyncHandler(controller.update));
  router.delete('/:id', requireAuth, asyncHandler(controller.remove));

  router.get('/:id/telefonos', requireAuth, asyncHandler(controller.listTelefonos));
  router.post('/:id/telefonos', requireAuth, asyncHandler(controller.createTelefono));
  router.patch('/:id/telefonos/:telefonoId', requireAuth, asyncHandler(controller.updateTelefono));
  router.delete('/:id/telefonos/:telefonoId', requireAuth, asyncHandler(controller.removeTelefono));
  return router;
}
