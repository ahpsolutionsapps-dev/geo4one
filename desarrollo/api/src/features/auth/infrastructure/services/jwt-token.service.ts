import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { UnauthorizedError } from '../../../../core/errors/app-error';
import { TokenPayload, TokenService } from '../../domain/services/token-service';

export class JwtTokenService implements TokenService {
  constructor(
    private readonly secret: Secret,
    private readonly expiresIn: SignOptions['expiresIn'] = '1d',
  ) {}

  sign(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verify(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.secret);
      if (typeof decoded === 'string') {
        throw new UnauthorizedError('Token inválido');
      }
      const { sub, username, actor, idCliente, idAgente } = decoded as jwt.JwtPayload &
        Partial<TokenPayload>;
      if (typeof sub !== 'string' || typeof username !== 'string') {
        throw new UnauthorizedError('Token inválido');
      }
      const resolvedActor: TokenPayload['actor'] =
        actor === 'cliente'
          ? 'cliente'
          : actor === 'plataforma'
            ? 'plataforma'
            : 'usuario';
      const resolvedClienteId =
        typeof idCliente === 'number' && Number.isInteger(idCliente) && idCliente > 0
          ? idCliente
          : undefined;
      const resolvedAgenteId =
        typeof idAgente === 'number' && Number.isInteger(idAgente) && idAgente > 0
          ? idAgente
          : undefined;
      return {
        sub,
        username,
        actor: resolvedActor,
        ...(resolvedClienteId ? { idCliente: resolvedClienteId } : {}),
        ...(resolvedAgenteId ? { idAgente: resolvedAgenteId } : {}),
      };
    } catch (err) {
      if (err instanceof UnauthorizedError) throw err;
      throw new UnauthorizedError('Token inválido o expirado');
    }
  }
}
