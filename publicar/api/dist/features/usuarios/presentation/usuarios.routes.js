"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUsuariosRouter = buildUsuariosRouter;
const express_1 = require("express");
const env_1 = require("../../../core/config/env");
const prisma_1 = require("../../../core/database/prisma");
const async_handler_1 = require("../../../core/http/async-handler");
const upload_service_client_1 = require("../../../shared/infrastructure/upload-service/upload-service.client");
const image_upload_middleware_1 = require("../../../shared/presentation/middlewares/image-upload.middleware");
const bcrypt_password_hasher_1 = require("../../auth/infrastructure/services/bcrypt-password-hasher");
const jwt_token_service_1 = require("../../auth/infrastructure/services/jwt-token.service");
const auth_middleware_1 = require("../../auth/presentation/middlewares/auth.middleware");
const anular_usuario_use_case_1 = require("../application/use-cases/anular-usuario.use-case");
const create_usuario_use_case_1 = require("../application/use-cases/create-usuario.use-case");
const delete_usuario_imagen_use_case_1 = require("../application/use-cases/delete-usuario-imagen.use-case");
const get_usuario_by_id_use_case_1 = require("../application/use-cases/get-usuario-by-id.use-case");
const get_usuarios_use_case_1 = require("../application/use-cases/get-usuarios.use-case");
const update_usuario_use_case_1 = require("../application/use-cases/update-usuario.use-case");
const upload_usuario_imagen_use_case_1 = require("../application/use-cases/upload-usuario-imagen.use-case");
const prisma_usuario_repository_1 = require("../infrastructure/repositories/prisma-usuario.repository");
const usuarios_controller_1 = require("./controllers/usuarios.controller");
function buildUsuariosRouter() {
    const repository = new prisma_usuario_repository_1.PrismaUsuarioRepository(prisma_1.prisma);
    const passwordHasher = new bcrypt_password_hasher_1.BcryptPasswordHasher();
    const uploadService = new upload_service_client_1.HttpUploadServiceClient({
        baseUrl: env_1.env.uploadService.baseUrl,
        apiKey: env_1.env.uploadService.apiKey,
        apiKeyHeader: env_1.env.uploadService.apiKeyHeader,
    });
    const tokenService = new jwt_token_service_1.JwtTokenService(env_1.env.jwt.secret, env_1.env.jwt.expiresIn);
    const getUsuarios = new get_usuarios_use_case_1.GetUsuariosUseCase(repository);
    const getUsuarioById = new get_usuario_by_id_use_case_1.GetUsuarioByIdUseCase(repository);
    const createUsuario = new create_usuario_use_case_1.CreateUsuarioUseCase(repository, passwordHasher);
    const updateUsuario = new update_usuario_use_case_1.UpdateUsuarioUseCase(repository, passwordHasher);
    const anularUsuario = new anular_usuario_use_case_1.AnularUsuarioUseCase(repository);
    const uploadUsuarioImagen = new upload_usuario_imagen_use_case_1.UploadUsuarioImagenUseCase(repository, uploadService);
    const deleteUsuarioImagen = new delete_usuario_imagen_use_case_1.DeleteUsuarioImagenUseCase(repository, uploadService);
    const controller = new usuarios_controller_1.UsuariosController(getUsuarios, getUsuarioById, createUsuario, updateUsuario, anularUsuario, uploadUsuarioImagen, deleteUsuarioImagen);
    const requireAuth = (0, auth_middleware_1.authMiddleware)(tokenService);
    const router = (0, express_1.Router)();
    router.get('/', requireAuth, (0, async_handler_1.asyncHandler)(controller.list));
    router.post('/:id/imagen', requireAuth, image_upload_middleware_1.imageUploadMiddleware, (0, async_handler_1.asyncHandler)(controller.uploadImagen));
    router.delete('/:id/imagen', requireAuth, (0, async_handler_1.asyncHandler)(controller.removeImagen));
    router.get('/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.getById));
    router.post('/', requireAuth, (0, async_handler_1.asyncHandler)(controller.create));
    router.patch('/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.update));
    router.delete('/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.remove));
    return router;
}
//# sourceMappingURL=usuarios.routes.js.map