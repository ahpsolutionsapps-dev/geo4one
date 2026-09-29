import rateLimit from 'express-rate-limit';
import { Router } from 'express';
import { env } from '../../config/env';
import { adminController, filesController, reportsController } from '../controllers';
import { adminMiddleware, apiKeyMiddleware, sanitizeInputMiddleware } from '../middlewares/auth.middleware';
import { uploadMiddleware, versionUploadMiddleware } from '../middlewares/upload.middleware';

const apiRateLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.apiKey?.id ?? req.ip ?? 'anonymous',
  message: {
    success: false,
    message: 'Demasiadas solicitudes, intente más tarde',
    code: 'RATE_LIMIT',
  },
});

export function buildFilesRouter(): Router {
  const router = Router();

  router.use(apiKeyMiddleware);
  router.use(apiRateLimiter);
  router.use(sanitizeInputMiddleware);

  router.post('/upload', uploadMiddleware, filesController.upload);
  router.get('/', filesController.list);
  router.get('/metrics', filesController.metrics);
  router.get('/download/:id', filesController.download);
  router.get('/:id/versions', filesController.listVersions);
  router.get('/:id', filesController.getById);
  router.delete('/:id', filesController.remove);
  router.post('/:id/restore', filesController.restore);
  router.post('/:id/categories', filesController.assignCategories);
  router.post('/:id/tags', filesController.assignTags);
  router.post('/:id/version', versionUploadMiddleware, filesController.createVersion);
  router.post('/:id/signed-url', filesController.createSignedUrl);

  return router;
}

export function buildSignedRouter(): Router {
  const router = Router();
  router.get('/:token', filesController.downloadSigned);
  return router;
}

export function buildReportsRouter(): Router {
  const router = Router();

  router.use(apiKeyMiddleware);
  router.use(apiRateLimiter);
  router.use(sanitizeInputMiddleware);

  router.post('/pdf', reportsController.generatePdf);

  return router;
}

export function buildAdminRouter(): Router {
  const router = Router();

  router.use(adminMiddleware);
  router.use(sanitizeInputMiddleware);

  router.post('/apikeys', adminController.createApiKey);
  router.get('/apikeys', adminController.listApiKeys);
  router.put('/apikeys/:id', adminController.updateApiKey);
  router.delete('/apikeys/:id', adminController.deleteApiKey);

  return router;
}
