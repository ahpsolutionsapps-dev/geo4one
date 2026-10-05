"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAuthRouter = buildAuthRouter;
const express_1 = require("express");
const async_handler_1 = require("../../../core/http/async-handler");
const env_1 = require("../../../core/config/env");
const prisma_1 = require("../../../core/database/prisma");
const approve_qr_login_session_use_case_1 = require("../application/use-cases/approve-qr-login-session.use-case");
const create_qr_login_session_use_case_1 = require("../application/use-cases/create-qr-login-session.use-case");
const get_current_user_use_case_1 = require("../application/use-cases/get-current-user.use-case");
const get_qr_login_session_status_use_case_1 = require("../application/use-cases/get-qr-login-session-status.use-case");
const get_user_menu_use_case_1 = require("../application/use-cases/get-user-menu.use-case");
const get_user_preferences_use_case_1 = require("../application/use-cases/get-user-preferences.use-case");
const confirm_password_reset_code_use_case_1 = require("../application/use-cases/confirm-password-reset-code.use-case");
const login_user_use_case_1 = require("../application/use-cases/login-user.use-case");
const register_user_use_case_1 = require("../application/use-cases/register-user.use-case");
const request_password_reset_code_use_case_1 = require("../application/use-cases/request-password-reset-code.use-case");
const reset_password_use_case_1 = require("../application/use-cases/reset-password.use-case");
const update_user_preferences_use_case_1 = require("../application/use-cases/update-user-preferences.use-case");
const prisma_modulo_repository_1 = require("../infrastructure/repositories/prisma-modulo.repository");
const prisma_user_repository_1 = require("../infrastructure/repositories/prisma-user.repository");
const bcrypt_password_hasher_1 = require("../infrastructure/services/bcrypt-password-hasher");
const jwt_token_service_1 = require("../infrastructure/services/jwt-token.service");
const password_reset_code_store_1 = require("../infrastructure/services/password-reset-code.store");
const email_service_client_1 = require("../../../shared/infrastructure/email-service/email-service.client");
const auth_controller_1 = require("./controllers/auth.controller");
const auth_middleware_1 = require("./middlewares/auth.middleware");
function buildAuthRouter() {
    const userRepository = new prisma_user_repository_1.PrismaUserRepository(prisma_1.prisma);
    const moduloRepository = new prisma_modulo_repository_1.PrismaModuloRepository(prisma_1.prisma);
    const passwordHasher = new bcrypt_password_hasher_1.BcryptPasswordHasher();
    const tokenService = new jwt_token_service_1.JwtTokenService(env_1.env.jwt.secret, env_1.env.jwt.expiresIn);
    const emailService = new email_service_client_1.HttpEmailServiceClient({
        baseUrl: env_1.env.emailService.baseUrl,
        apiKey: env_1.env.emailService.apiKey,
        apiKeyHeader: env_1.env.emailService.apiKeyHeader,
    });
    const registerUser = new register_user_use_case_1.RegisterUserUseCase(userRepository, passwordHasher, tokenService);
    const loginUser = new login_user_use_case_1.LoginUserUseCase(userRepository, passwordHasher, tokenService);
    const resetPassword = new reset_password_use_case_1.ResetPasswordUseCase(userRepository, passwordHasher);
    const requestPasswordResetCode = new request_password_reset_code_use_case_1.RequestPasswordResetCodeUseCase(userRepository, password_reset_code_store_1.passwordResetCodeStore, emailService);
    const confirmPasswordResetCode = new confirm_password_reset_code_use_case_1.ConfirmPasswordResetCodeUseCase(userRepository, passwordHasher, password_reset_code_store_1.passwordResetCodeStore);
    const getCurrentUser = new get_current_user_use_case_1.GetCurrentUserUseCase(userRepository);
    const getUserMenu = new get_user_menu_use_case_1.GetUserMenuUseCase(userRepository, moduloRepository);
    const getUserPreferences = new get_user_preferences_use_case_1.GetUserPreferencesUseCase(userRepository);
    const updateUserPreferences = new update_user_preferences_use_case_1.UpdateUserPreferencesUseCase(userRepository);
    const createQrLoginSession = new create_qr_login_session_use_case_1.CreateQrLoginSessionUseCase();
    const getQrLoginSessionStatus = new get_qr_login_session_status_use_case_1.GetQrLoginSessionStatusUseCase(userRepository);
    const approveQrLoginSession = new approve_qr_login_session_use_case_1.ApproveQrLoginSessionUseCase(userRepository, tokenService);
    const controller = new auth_controller_1.AuthController(registerUser, loginUser, resetPassword, requestPasswordResetCode, confirmPasswordResetCode, getCurrentUser, getUserMenu, getUserPreferences, updateUserPreferences, createQrLoginSession, getQrLoginSessionStatus, approveQrLoginSession);
    const requireAuth = (0, auth_middleware_1.authMiddleware)(tokenService);
    const router = (0, express_1.Router)();
    router.post('/register', (0, async_handler_1.asyncHandler)(controller.register));
    router.post('/login', (0, async_handler_1.asyncHandler)(controller.login));
    router.post('/reset-password', (0, async_handler_1.asyncHandler)(controller.resetPasswordHandler));
    router.post('/reset-password/request-code', (0, async_handler_1.asyncHandler)(controller.requestPasswordResetCodeHandler));
    router.post('/reset-password/confirm-code', (0, async_handler_1.asyncHandler)(controller.confirmPasswordResetCodeHandler));
    router.post('/qr/session', (0, async_handler_1.asyncHandler)(controller.createQrSession));
    router.get('/qr/session/:code', (0, async_handler_1.asyncHandler)(controller.getQrSessionStatus));
    router.post('/qr/approve', requireAuth, (0, async_handler_1.asyncHandler)(controller.approveQrSession));
    router.get('/me', requireAuth, (0, async_handler_1.asyncHandler)(controller.me));
    router.get('/menu', requireAuth, (0, async_handler_1.asyncHandler)(controller.menu));
    router.get('/preferences', requireAuth, (0, async_handler_1.asyncHandler)(controller.getPreferences));
    router.patch('/preferences', requireAuth, (0, async_handler_1.asyncHandler)(controller.updatePreferences));
    return router;
}
//# sourceMappingURL=auth.routes.js.map