import { AppError } from '../../../core/errors/app-error';

export interface SendPasswordResetCodeInput {
  to: string;
  code: string;
  appName?: string;
  expiresInMinutes?: number;
}

export interface SendPasswordResetCodeResult {
  message: string;
  messageId?: string;
  previewUrl?: string;
}

interface EmailServiceClientOptions {
  baseUrl: string;
  apiKey: string;
  apiKeyHeader?: string;
}

export interface SendInvitationEmailInput {
  to: string;
  businessName: string;
  contactName: string;
  activationUrl: string;
  planName: string;
  expiresInDays: number;
}

export interface EmailServiceClient {
  sendPasswordResetCode(
    input: SendPasswordResetCodeInput,
  ): Promise<SendPasswordResetCodeResult>;
  sendInvitation(input: SendInvitationEmailInput): Promise<SendPasswordResetCodeResult>;
}

export class HttpEmailServiceClient implements EmailServiceClient {
  private readonly apiKeyHeader: string;

  constructor(private readonly options: EmailServiceClientOptions) {
    this.apiKeyHeader = options.apiKeyHeader ?? 'X-API-KEY';
  }

  async sendPasswordResetCode(
    input: SendPasswordResetCodeInput,
  ): Promise<SendPasswordResetCodeResult> {
    return this.postJson('/api/emails/password-reset-code', {
      to: input.to,
      code: input.code,
      appName: input.appName,
      expiresInMinutes: input.expiresInMinutes,
    }, 'Error al enviar el correo de recuperación');
  }

  async sendInvitation(
    input: SendInvitationEmailInput,
  ): Promise<SendPasswordResetCodeResult> {
    return this.postJson('/api/emails/send', {
      to: input.to,
      template: 'invitation',
      subject: `Activa tu cuenta de ${input.businessName}`,
      props: {
        businessName: input.businessName,
        contactName: input.contactName,
        activationUrl: input.activationUrl,
        planName: input.planName,
        expiresInDays: input.expiresInDays,
      },
    }, 'Error al enviar la invitación');
  }

  private async postJson(
    path: string,
    body: unknown,
    errorMessage: string,
  ): Promise<SendPasswordResetCodeResult> {
    const baseUrl = this.options.baseUrl.replace(/\/$/, '');
    let response: Response;

    try {
      response = await fetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [this.apiKeyHeader]: this.options.apiKey,
        },
        body: JSON.stringify(body),
      });
    } catch {
      throw new AppError(
        'No se pudo conectar con el servicio de correo',
        502,
        'EMAIL_SERVICE_UNAVAILABLE',
      );
    }

    const payload = (await response.json().catch(() => null)) as {
      message?: string;
      messageId?: string;
      previewUrl?: string;
    } | null;

    if (!response.ok) {
      throw new AppError(
        payload?.message ?? errorMessage,
        response.status >= 400 ? response.status : 502,
        'EMAIL_SERVICE_ERROR',
      );
    }

    return {
      message: payload?.message ?? 'Correo enviado',
      messageId: payload?.messageId,
      previewUrl: payload?.previewUrl,
    };
  }
}
