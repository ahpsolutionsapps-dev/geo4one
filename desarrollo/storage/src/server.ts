import { createApp } from './app';
import { env } from './config/env';
import { logger } from './infrastructure/security/logger';

async function bootstrap(): Promise<void> {
  const app = createApp();

  app.listen(env.port, () => {
    logger.info(`Upload Service [${env.nodeEnv}] escuchando en ${env.publicUrl}`);
  });
}

bootstrap().catch((error) => {
  logger.error('Error al iniciar el servidor', { error });
  process.exit(1);
});
