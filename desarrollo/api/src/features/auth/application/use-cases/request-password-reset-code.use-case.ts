import { env } from '../../../../core/config/env';
import { EmailServiceClient } from '../../../../shared/infrastructure/email-service/email-service.client';
import { UserRepository } from '../../domain/repositories/user-repository';
import { PasswordResetCodeStore } from '../../infrastructure/services/password-reset-code.store';

export interface RequestPasswordResetCodeResult {
  message: string;
  expiresInSeconds: number;
  /** Solo en desarrollo, cuando el servicio de correo expone vista previa. */
  previewUrl?: string;
}

export class RequestPasswordResetCodeUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly codes: PasswordResetCodeStore,
    private readonly emailService: EmailServiceClient,
  ) {}

  async execute(email: string): Promise<RequestPasswordResetCodeResult> {
    const normalizedEmail = email.trim();
    const user = await this.users.findByEmail(normalizedEmail);

    // Respuesta genérica para no revelar si el correo existe.
    const baseResponse: RequestPasswordResetCodeResult = {
      message:
        'Si el correo está registrado, te enviamos un código de verificación.',
      expiresInSeconds: 600,
    };

    if (!user || !user.canLogin()) {
      return baseResponse;
    }

    const { code } = this.codes.create(normalizedEmail);

    try {
      const sent = await this.emailService.sendPasswordResetCode({
        to: normalizedEmail,
        code,
        appName: 'App Gestion Negocios',
        expiresInMinutes: 10,
      });

      if (env.isDevelopment) {
        console.info(
          `[reset-password] Código enviado a ${normalizedEmail}` +
            (sent.previewUrl ? ` | preview: ${sent.previewUrl}` : ''),
        );
      }

      return {
        ...baseResponse,
        previewUrl: env.isDevelopment ? sent.previewUrl : undefined,
      };
    } catch (error) {
      // Evita dejar un código huérfano si el correo no se pudo enviar.
      this.codes.invalidate(normalizedEmail);

      if (env.isDevelopment) {
        console.error('[reset-password] Error al enviar código', error);
      }

      throw error;
    }
  }
}
