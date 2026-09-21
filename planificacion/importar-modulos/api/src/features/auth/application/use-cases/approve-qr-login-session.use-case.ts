import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../../../../core/errors/app-error';
import { prisma } from '../../../../core/database/prisma';
import { UserRepository } from '../../domain/repositories/user-repository';
import { TokenService } from '../../domain/services/token-service';
import { QR_LOGIN_PAYLOAD_PREFIX } from './create-qr-login-session.use-case';

export interface ApproveQrLoginSessionResult {
  ok: true;
  deviceName: string | null;
}

export class ApproveQrLoginSessionUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly tokens: TokenService,
  ) {}

  async execute(idUsuario: number, rawCode: string): Promise<ApproveQrLoginSessionResult> {
    const code = this.normalizeCode(rawCode);
    if (!code) {
      throw new NotFoundError('Código QR inválido');
    }

    const user = await this.users.findById(idUsuario);
    if (!user || !user.canLogin()) {
      throw new UnauthorizedError('Usuario no autorizado');
    }
    if (!user.canAccessModules()) {
      throw new ForbiddenError('La cuenta debe estar verificada para vincular dispositivos');
    }

    const session = await prisma.qrLoginSession.findFirst({
      where: { code },
    });

    if (!session) {
      throw new NotFoundError('Sesión QR no encontrada');
    }

    if (session.status === 'consumed') {
      throw new ConflictError('Este código QR ya fue utilizado');
    }

    if (session.status === 'approved') {
      throw new ConflictError('Este código QR ya fue aprobado');
    }

    if (session.status === 'expired' || session.expiraEn.getTime() <= Date.now()) {
      if (session.status !== 'expired') {
        await prisma.qrLoginSession.update({
          where: { idQrLoginSession: session.idQrLoginSession },
          data: { status: 'expired' },
        });
      }
      throw new ConflictError('El código QR ha expirado. Genera uno nuevo en el dispositivo.');
    }

    if (session.status !== 'pending') {
      throw new ConflictError('La sesión QR no está disponible');
    }

    const token = this.tokens.sign({
      sub: String(user.idUsuario),
      username: user.username,
    });

    await prisma.qrLoginSession.update({
      where: { idQrLoginSession: session.idQrLoginSession },
      data: {
        status: 'approved',
        idUsuario: user.idUsuario,
        token,
        aprobadoEn: new Date(),
      },
    });

    return {
      ok: true,
      deviceName: session.deviceName,
    };
  }

  private normalizeCode(raw: string): string | null {
    const value = raw.trim();
    if (!value) {
      return null;
    }

    if (value.startsWith(QR_LOGIN_PAYLOAD_PREFIX)) {
      const code = value.slice(QR_LOGIN_PAYLOAD_PREFIX.length).trim();
      return code || null;
    }

    try {
      const parsed = JSON.parse(value) as { t?: unknown; c?: unknown };
      if (parsed?.t === 'device-link' && typeof parsed.c === 'string') {
        const code = parsed.c.trim();
        return code || null;
      }
    } catch {
      // plain code
    }

    if (/^[A-Za-z0-9_-]{16,64}$/.test(value)) {
      return value;
    }

    return null;
  }
}
