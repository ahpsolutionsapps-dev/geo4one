import { Router } from 'express';
import { env } from '../../../core/config/env';
import { prisma } from '../../../core/database/prisma';
import { asyncHandler } from '../../../core/http/async-handler';
import { HttpUploadServiceClient } from '../../../shared/infrastructure/upload-service/upload-service.client';
import { imageUploadMiddleware } from '../../../shared/presentation/middlewares/image-upload.middleware';
import { BcryptPasswordHasher } from '../../auth/infrastructure/services/bcrypt-password-hasher';
import { JwtTokenService } from '../../auth/infrastructure/services/jwt-token.service';
import { authMiddleware } from '../../auth/presentation/middlewares/auth.middleware';
import { AnularUsuarioUseCase } from '../application/use-cases/anular-usuario.use-case';
import { CreateUsuarioUseCase } from '../application/use-cases/create-usuario.use-case';
import { DeleteUsuarioImagenUseCase } from '../application/use-cases/delete-usuario-imagen.use-case';
import { GetUsuarioByIdUseCase } from '../application/use-cases/get-usuario-by-id.use-case';
import { GetUsuariosUseCase } from '../application/use-cases/get-usuarios.use-case';
import { UpdateUsuarioUseCase } from '../application/use-cases/update-usuario.use-case';
import { UploadUsuarioImagenUseCase } from '../application/use-cases/upload-usuario-imagen.use-case';
import { PrismaUsuarioRepository } from '../infrastructure/repositories/prisma-usuario.repository';
import { UsuariosController } from './controllers/usuarios.controller';

export function buildUsuariosRouter(): Router {
  const repository = new PrismaUsuarioRepository(prisma);
  const passwordHasher = new BcryptPasswordHasher();
  const uploadService = new HttpUploadServiceClient({
    baseUrl: env.uploadService.baseUrl,
    apiKey: env.uploadService.apiKey,
    apiKeyHeader: env.uploadService.apiKeyHeader,
  });
  const tokenService = new JwtTokenService(env.jwt.secret, env.jwt.expiresIn);

  const getUsuarios = new GetUsuariosUseCase(repository);
  const getUsuarioById = new GetUsuarioByIdUseCase(repository);
  const createUsuario = new CreateUsuarioUseCase(repository, passwordHasher);
  const updateUsuario = new UpdateUsuarioUseCase(repository, passwordHasher);
  const anularUsuario = new AnularUsuarioUseCase(repository);
  const uploadUsuarioImagen = new UploadUsuarioImagenUseCase(repository, uploadService);
  const deleteUsuarioImagen = new DeleteUsuarioImagenUseCase(repository, uploadService);

  const controller = new UsuariosController(
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    anularUsuario,
    uploadUsuarioImagen,
    deleteUsuarioImagen,
  );

  const requireAuth = authMiddleware(tokenService);

  const router = Router();
  router.get('/', requireAuth, asyncHandler(controller.list));
  router.post(
    '/:id/imagen',
    requireAuth,
    imageUploadMiddleware,
    asyncHandler(controller.uploadImagen),
  );
  router.delete('/:id/imagen', requireAuth, asyncHandler(controller.removeImagen));
  router.get('/:id', requireAuth, asyncHandler(controller.getById));
  router.post('/', requireAuth, asyncHandler(controller.create));
  router.patch('/:id', requireAuth, asyncHandler(controller.update));
  router.delete('/:id', requireAuth, asyncHandler(controller.remove));
  return router;
}
