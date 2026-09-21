import { Router } from 'express';
import { asyncHandler } from '../../../core/http/async-handler';
import { env } from '../../../core/config/env';
import { prisma } from '../../../core/database/prisma';
import { ApproveQrLoginSessionUseCase } from '../application/use-cases/approve-qr-login-session.use-case';
import { CreateQrLoginSessionUseCase } from '../application/use-cases/create-qr-login-session.use-case';
import { GetCurrentUserUseCase } from '../application/use-cases/get-current-user.use-case';
import { GetQrLoginSessionStatusUseCase } from '../application/use-cases/get-qr-login-session-status.use-case';
import { GetUserMenuUseCase } from '../application/use-cases/get-user-menu.use-case';
import { GetUserPreferencesUseCase } from '../application/use-cases/get-user-preferences.use-case';
import { ConfirmPasswordResetCodeUseCase } from '../application/use-cases/confirm-password-reset-code.use-case';
import { LoginUserUseCase } from '../application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case';
import { RequestPasswordResetCodeUseCase } from '../application/use-cases/request-password-reset-code.use-case';
import { ResetPasswordUseCase } from '../application/use-cases/reset-password.use-case';
import { UpdateUserPreferencesUseCase } from '../application/use-cases/update-user-preferences.use-case';
import { PrismaModuloRepository } from '../infrastructure/repositories/prisma-modulo.repository';
import { PrismaUserRepository } from '../infrastructure/repositories/prisma-user.repository';
import { BcryptPasswordHasher } from '../infrastructure/services/bcrypt-password-hasher';
import { JwtTokenService } from '../infrastructure/services/jwt-token.service';
import { passwordResetCodeStore } from '../infrastructure/services/password-reset-code.store';
import { HttpEmailServiceClient } from '../../../shared/infrastructure/email-service/email-service.client';
import { AuthController } from './controllers/auth.controller';
import { authMiddleware } from './middlewares/auth.middleware';

export function buildAuthRouter(): Router {
  const userRepository = new PrismaUserRepository(prisma);
  const moduloRepository = new PrismaModuloRepository(prisma);
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService(env.jwt.secret, env.jwt.expiresIn);
  const emailService = new HttpEmailServiceClient({
    baseUrl: env.emailService.baseUrl,
    apiKey: env.emailService.apiKey,
    apiKeyHeader: env.emailService.apiKeyHeader,
  });

  const registerUser = new RegisterUserUseCase(userRepository, passwordHasher, tokenService);
  const loginUser = new LoginUserUseCase(userRepository, passwordHasher, tokenService);
  const resetPassword = new ResetPasswordUseCase(userRepository, passwordHasher);
  const requestPasswordResetCode = new RequestPasswordResetCodeUseCase(
    userRepository,
    passwordResetCodeStore,
    emailService,
  );
  const confirmPasswordResetCode = new ConfirmPasswordResetCodeUseCase(
    userRepository,
    passwordHasher,
    passwordResetCodeStore,
  );
  const getCurrentUser = new GetCurrentUserUseCase(userRepository);
  const getUserMenu = new GetUserMenuUseCase(userRepository, moduloRepository);
  const getUserPreferences = new GetUserPreferencesUseCase(userRepository);
  const updateUserPreferences = new UpdateUserPreferencesUseCase(userRepository);
  const createQrLoginSession = new CreateQrLoginSessionUseCase();
  const getQrLoginSessionStatus = new GetQrLoginSessionStatusUseCase(userRepository);
  const approveQrLoginSession = new ApproveQrLoginSessionUseCase(userRepository, tokenService);

  const controller = new AuthController(
    registerUser,
    loginUser,
    resetPassword,
    requestPasswordResetCode,
    confirmPasswordResetCode,
    getCurrentUser,
    getUserMenu,
    getUserPreferences,
    updateUserPreferences,
    createQrLoginSession,
    getQrLoginSessionStatus,
    approveQrLoginSession,
  );
  const requireAuth = authMiddleware(tokenService);

  const router = Router();
  router.post('/register', asyncHandler(controller.register));
  router.post('/login', asyncHandler(controller.login));
  router.post('/reset-password', asyncHandler(controller.resetPasswordHandler));
  router.post(
    '/reset-password/request-code',
    asyncHandler(controller.requestPasswordResetCodeHandler),
  );
  router.post(
    '/reset-password/confirm-code',
    asyncHandler(controller.confirmPasswordResetCodeHandler),
  );
  router.post('/qr/session', asyncHandler(controller.createQrSession));
  router.get('/qr/session/:code', asyncHandler(controller.getQrSessionStatus));
  router.post('/qr/approve', requireAuth, asyncHandler(controller.approveQrSession));
  router.get('/me', requireAuth, asyncHandler(controller.me));
  router.get('/menu', requireAuth, asyncHandler(controller.menu));
  router.get('/preferences', requireAuth, asyncHandler(controller.getPreferences));
  router.patch('/preferences', requireAuth, asyncHandler(controller.updatePreferences));
  return router;
}
