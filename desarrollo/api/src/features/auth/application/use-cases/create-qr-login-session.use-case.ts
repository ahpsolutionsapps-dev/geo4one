import { randomBytes } from 'crypto';
import { prisma } from '../../../../core/database/prisma';

const SESSION_TTL_MS = 2 * 60 * 1000;
export const QR_LOGIN_PAYLOAD_PREFIX = 'AGN_DEVICE_LINK:v1:';

export interface CreateQrLoginSessionResult {
  code: string;
  payload: string;
  expiresAt: string;
  expiresInSeconds: number;
}

export class CreateQrLoginSessionUseCase {
  async execute(input?: { deviceName?: string }): Promise<CreateQrLoginSessionResult> {
    const code = randomBytes(24).toString('base64url');
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    await prisma.qrLoginSession.create({
      data: {
        code,
        status: 'pending',
        deviceName: input?.deviceName?.trim() || null,
        expiraEn: expiresAt,
      },
    });

    return {
      code,
      payload: `${QR_LOGIN_PAYLOAD_PREFIX}${code}`,
      expiresAt: expiresAt.toISOString(),
      expiresInSeconds: Math.floor(SESSION_TTL_MS / 1000),
    };
  }
}
