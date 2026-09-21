import { Request, Response } from 'express';
import { ApproveQrLoginSessionUseCase } from '../../application/use-cases/approve-qr-login-session.use-case';
import { ConfirmPasswordResetCodeUseCase } from '../../application/use-cases/confirm-password-reset-code.use-case';
import { CreateQrLoginSessionUseCase } from '../../application/use-cases/create-qr-login-session.use-case';
import { GetCurrentUserUseCase } from '../../application/use-cases/get-current-user.use-case';
import { GetQrLoginSessionStatusUseCase } from '../../application/use-cases/get-qr-login-session-status.use-case';
import { GetUserMenuUseCase } from '../../application/use-cases/get-user-menu.use-case';
import { GetUserPreferencesUseCase } from '../../application/use-cases/get-user-preferences.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { RequestPasswordResetCodeUseCase } from '../../application/use-cases/request-password-reset-code.use-case';
import { ResetPasswordUseCase } from '../../application/use-cases/reset-password.use-case';
import { UpdateUserPreferencesUseCase } from '../../application/use-cases/update-user-preferences.use-case';
import {
  approveQrLoginSessionSchema,
  confirmPasswordResetCodeSchema,
  createQrLoginSessionSchema,
  loginSchema,
  registerSchema,
  requestPasswordResetCodeSchema,
  resetPasswordSchema,
  updatePreferencesSchema,
} from '../validators/auth.schemas';
import { UnauthorizedError } from '../../../../core/errors/app-error';

export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUserUseCase,
    private readonly resetPassword: ResetPasswordUseCase,
    private readonly requestPasswordResetCode: RequestPasswordResetCodeUseCase,
    private readonly confirmPasswordResetCode: ConfirmPasswordResetCodeUseCase,
    private readonly getCurrentUser: GetCurrentUserUseCase,
    private readonly getUserMenu: GetUserMenuUseCase,
    private readonly getUserPreferences: GetUserPreferencesUseCase,
    private readonly updateUserPreferences: UpdateUserPreferencesUseCase,
    private readonly createQrLoginSession: CreateQrLoginSessionUseCase,
    private readonly getQrLoginSessionStatus: GetQrLoginSessionStatusUseCase,
    private readonly approveQrLoginSession: ApproveQrLoginSessionUseCase,
  ) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const data = registerSchema.parse(req.body);
    const result = await this.registerUser.execute(data);
    res.status(201).json(result);
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const data = loginSchema.parse(req.body);
    const result = await this.loginUser.execute(data);
    res.status(200).json(result);
  };

  resetPasswordHandler = async (req: Request, res: Response): Promise<void> => {
    const data = resetPasswordSchema.parse(req.body);
    const result = await this.resetPassword.execute(data);
    res.status(200).json(result);
  };

  requestPasswordResetCodeHandler = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const data = requestPasswordResetCodeSchema.parse(req.body);
    const result = await this.requestPasswordResetCode.execute(data.email);
    res.status(200).json(result);
  };

  confirmPasswordResetCodeHandler = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const data = confirmPasswordResetCodeSchema.parse(req.body);
    const result = await this.confirmPasswordResetCode.execute(data);
    res.status(200).json(result);
  };

  me = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = this.resolveUserId(req);
    const result = await this.getCurrentUser.execute(idUsuario);
    res.status(200).json(result);
  };

  menu = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = this.resolveUserId(req);
    const menu = await this.getUserMenu.execute(idUsuario);
    res.status(200).json(menu);
  };

  getPreferences = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = this.resolveUserId(req);
    const item = await this.getUserPreferences.execute(idUsuario);
    res.status(200).json({ item });
  };

  updatePreferences = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = this.resolveUserId(req);
    const data = updatePreferencesSchema.parse(req.body);
    const item = await this.updateUserPreferences.execute(idUsuario, data);
    res.status(200).json({ item });
  };

  createQrSession = async (req: Request, res: Response): Promise<void> => {
    const data = createQrLoginSessionSchema.parse(req.body ?? {});
    const result = await this.createQrLoginSession.execute(data);
    res.status(201).json(result);
  };

  getQrSessionStatus = async (req: Request, res: Response): Promise<void> => {
    const code = String(req.params.code ?? '').trim();
    const result = await this.getQrLoginSessionStatus.execute(code);
    res.status(200).json(result);
  };

  approveQrSession = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = this.resolveUserId(req);
    const data = approveQrLoginSessionSchema.parse(req.body);
    const result = await this.approveQrLoginSession.execute(idUsuario, data.code);
    res.status(200).json(result);
  };

  private resolveUserId(req: Request): number {
    const sub = req.auth?.sub;
    if (!sub) {
      throw new UnauthorizedError();
    }
    const idUsuario = Number(sub);
    if (!Number.isInteger(idUsuario)) {
      throw new UnauthorizedError('Token inválido');
    }
    return idUsuario;
  }
}
