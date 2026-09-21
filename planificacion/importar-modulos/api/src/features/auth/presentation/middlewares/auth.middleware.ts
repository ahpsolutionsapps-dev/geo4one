import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../../../../core/errors/app-error';
import { TokenService } from '../../domain/services/token-service';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: {
        sub: string;
        username: string;
        actor?: 'usuario' | 'cliente' | 'plataforma';
        idCliente?: number;
        idAgente?: number;
      };
      plataforma?: {
        idAgente: number;
        email: string;
        nombre: string;
        rol: string;
        puedePersonalizar: boolean;
      };
    }
  }
}

export function authMiddleware(tokens: TokenService) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Token no provisto'));
    }
    try {
      const token = header.slice('Bearer '.length).trim();
      const payload = tokens.verify(token);
      if (payload.actor === 'cliente' || payload.actor === 'plataforma') {
        return next(new UnauthorizedError('Token de usuario requerido'));
      }
      req.auth = payload;
      next();
    } catch (err) {
      next(err);
    }
  };
}
