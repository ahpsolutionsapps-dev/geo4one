import cors from 'cors';
import express, { Application } from 'express';
import { env } from './core/config/env';
import { prisma } from './core/database/prisma';
import { errorHandler } from './core/http/error-handler';
import { JwtTokenService } from './features/auth/infrastructure/services/jwt-token.service';
import { PrismaUserRepository } from './features/auth/infrastructure/repositories/prisma-user.repository';
import { buildAuthRouter } from './features/auth/presentation/auth.routes';
import { authMiddleware } from './features/auth/presentation/middlewares/auth.middleware';
import { requireVerifiedMiddleware } from './features/auth/presentation/middlewares/require-verified.middleware';
import { buildRolesRouter } from './features/roles/presentation/roles.routes';
import { buildProvinciasRouter } from './features/provincias/presentation/provincias.routes';
import { buildMunicipiosRouter } from './features/municipios/presentation/municipios.routes';
import { buildSectoresRouter } from './features/sectores/presentation/sectores.routes';
import { buildUsuariosRouter } from './features/usuarios/presentation/usuarios.routes';
import { buildElementosRouter } from './features/elementos/presentation/elementos.routes';
import { buildProveedoresRouter } from './features/proveedores/presentation/proveedores.routes';

export function createApp(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/auth', buildAuthRouter());

  // Los módulos de negocio exigen sesión y cuenta verificada.
  // /auth (me, menu, preferences) queda fuera para permitir login sin módulos.
  const tokenService = new JwtTokenService(env.jwt.secret, env.jwt.expiresIn);
  const userRepository = new PrismaUserRepository(prisma);
  app.use(authMiddleware(tokenService), requireVerifiedMiddleware(userRepository));

  app.use('/usuarios', buildUsuariosRouter());
  app.use('/roles', buildRolesRouter());
  app.use('/provincias', buildProvinciasRouter());
  app.use('/municipios', buildMunicipiosRouter());
  app.use('/sectores', buildSectoresRouter());
  app.use('/proveedores', buildProveedoresRouter());
  app.use('/elementos', buildElementosRouter());

  app.use(errorHandler);
  return app;
}
