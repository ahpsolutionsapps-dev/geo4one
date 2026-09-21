import { NotFoundError } from '../../../../core/errors/app-error';
import { prisma } from '../../../../core/database/prisma';
import { PublicUserProps } from '../../domain/entities/user';
import { UserRepository } from '../../domain/repositories/user-repository';

export type QrLoginSessionStatus = 'pending' | 'approved' | 'expired' | 'consumed';

export interface GetQrLoginSessionStatusResult {
  status: QrLoginSessionStatus;
  expiresAt: string;
  user?: PublicUserProps;
  token?: string;
}

export class GetQrLoginSessionStatusUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(code: string): Promise<GetQrLoginSessionStatusResult> {
    const session = await prisma.qrLoginSession.findFirst({
      where: { code },
    });

    if (!session) {
      throw new NotFoundError('Sesión QR no encontrada');
    }

    if (session.status === 'consumed') {
      return {
        status: 'consumed',
        expiresAt: session.expiraEn.toISOString(),
      };
    }

    if (session.status === 'expired' || session.expiraEn.getTime() <= Date.now()) {
      if (session.status !== 'expired') {
        await prisma.qrLoginSession.update({
          where: { idQrLoginSession: session.idQrLoginSession },
          data: { status: 'expired' },
        });
      }
      return {
        status: 'expired',
        expiresAt: session.expiraEn.toISOString(),
      };
    }

    if (session.status === 'pending') {
      return {
        status: 'pending',
        expiresAt: session.expiraEn.toISOString(),
      };
    }

    if (session.status === 'approved' && session.idUsuario && session.token) {
      const user = await this.users.findById(session.idUsuario);
      if (!user || !user.canLogin()) {
        await prisma.qrLoginSession.update({
          where: { idQrLoginSession: session.idQrLoginSession },
          data: { status: 'expired', token: null },
        });
        return {
          status: 'expired',
          expiresAt: session.expiraEn.toISOString(),
        };
      }

      await prisma.qrLoginSession.update({
        where: { idQrLoginSession: session.idQrLoginSession },
        data: {
          status: 'consumed',
          consumidoEn: new Date(),
          token: null,
        },
      });

      return {
        status: 'approved',
        expiresAt: session.expiraEn.toISOString(),
        user: user.toPublic(),
        token: session.token,
      };
    }

    return {
      status: 'expired',
      expiresAt: session.expiraEn.toISOString(),
    };
  }
}
