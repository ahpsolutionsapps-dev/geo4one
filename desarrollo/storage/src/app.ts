import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { isDatabaseHealthy } from './infrastructure/database/prisma.client';
import { LocalStorageService } from './infrastructure/storage/local-storage.service';
import { logger } from './infrastructure/security/logger';
import { errorHandler } from './presentation/middlewares/error.middleware';
import {
  buildAdminRouter,
  buildFilesRouter,
  buildReportsRouter,
  buildSignedRouter,
} from './presentation/routes';
import { swaggerSpec } from './presentation/swagger';

export function createApp(): Application {
  const app = express();
  const storageService = new LocalStorageService();

  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigin === '*' ? true : env.corsOrigin.split(','),
    }),
  );

  if (env.enableCompression) {
    app.use(compression());
  }

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', async (_req, res) => {
    const [database, storage] = await Promise.all([
      isDatabaseHealthy(),
      storageService.isStorageHealthy(),
    ]);

    res.status(database && storage ? 200 : 503).json({
      status: database && storage ? 'ok' : 'degraded',
      database,
      storage,
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api/files/signed', buildSignedRouter());
  app.use('/api/files', buildFilesRouter());
  app.use('/api/reports', buildReportsRouter());
  app.use('/api/admin', buildAdminRouter());

  app.use(errorHandler);

  logger.info('Aplicación configurada', { port: env.port });
  return app;
}
