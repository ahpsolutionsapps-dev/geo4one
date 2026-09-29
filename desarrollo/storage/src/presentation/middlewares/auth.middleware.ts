import { NextFunction, Request, Response } from 'express';
import { env } from '../../config/env';
import { container } from '../../config/container';
import { AUDIT_ACTIONS } from '../../shared/constants';
import { UnauthorizedError } from '../../shared/errors/app-error';
import { logger } from '../../infrastructure/security/logger';
import { v4 as uuidv4 } from 'uuid';

export async function apiKeyMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const apiKeyValue = req.header(env.apiKeyHeader);

    if (!apiKeyValue) {
      throw new UnauthorizedError(`Header ${env.apiKeyHeader} requerido`);
    }

    const apiKey = await container.repositories.apiKeyRepository.findByKey(apiKeyValue);

    if (!apiKey) {
      await container.repositories.auditLogRepository.create({
        id: uuidv4(),
        apiKeyId: null,
        action: AUDIT_ACTIONS.REJECTED,
        fileId: null,
        details: 'API Key inválida',
        ipAddress: req.ip ?? null,
      });
      logger.warn('Acceso rechazado: API Key inválida', { ip: req.ip });
      throw new UnauthorizedError('API Key inválida');
    }

    if (!apiKey.isActive) {
      await container.repositories.auditLogRepository.create({
        id: uuidv4(),
        apiKeyId: apiKey.id,
        action: AUDIT_ACTIONS.REJECTED,
        fileId: null,
        details: 'API Key inactiva',
        ipAddress: req.ip ?? null,
      });
      throw new UnauthorizedError('API Key inactiva');
    }

    await container.repositories.apiKeyRepository.updateLastUsed(apiKey.id);
    req.apiKey = { id: apiKey.id, name: apiKey.name };
    next();
  } catch (error) {
    next(error);
  }
}

export function adminMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const adminToken = req.header('X-Admin-Token');

  if (!adminToken || adminToken !== env.adminToken) {
    next(new UnauthorizedError('Token de administración inválido'));
    return;
  }

  next();
}

export function sanitizeInputMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (req.body && typeof req.body === 'object') {
    for (const [key, value] of Object.entries(req.body)) {
      if (typeof value === 'string') {
        req.body[key] = value.replace(/[<>]/g, '').trim();
      }
    }
  }
  next();
}
