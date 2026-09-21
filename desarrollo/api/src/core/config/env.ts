import './load-env';
import type { SignOptions } from 'jsonwebtoken';
import { runtimeEnv } from './load-env';

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Variable de entorno faltante: ${name}`);
  }
  return value;
}

const jwtSecret = required(
  'JWT_SECRET',
  runtimeEnv === 'production' ? undefined : 'dev-secret-change-me',
);

if (runtimeEnv === 'production' && jwtSecret === 'dev-secret-change-me') {
  throw new Error('JWT_SECRET debe configurarse con un valor seguro en producción');
}

export const env = {
  nodeEnv: runtimeEnv,
  isProduction: runtimeEnv === 'production',
  isDevelopment: runtimeEnv === 'development',
  port: Number(process.env.PORT ?? 3000),
  jwt: {
    secret: jwtSecret,
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '1d') as SignOptions['expiresIn'],
  },
  uploadService: {
    baseUrl: required('UPLOAD_SERVICE_URL', 'http://localhost:4000'),
    apiKey: required(
      'UPLOAD_SERVICE_API_KEY',
      runtimeEnv === 'production'
        ? undefined
        : 'a6e125ea4b3ab9702205b783432877e30fcf8d0dc431f59667f403d822eb2215',
    ),
    apiKeyHeader: process.env.UPLOAD_SERVICE_API_KEY_HEADER ?? 'X-API-KEY',
  },
  emailService: {
    baseUrl: required('EMAIL_SERVICE_URL', 'http://localhost:4001'),
    apiKey: required(
      'EMAIL_SERVICE_API_KEY',
      runtimeEnv === 'production'
        ? undefined
        : 'dev-email-service-key-change-me',
    ),
    apiKeyHeader: process.env.EMAIL_SERVICE_API_KEY_HEADER ?? 'X-API-KEY',
  },
  comercial: {
    appUrl: process.env.COMERCIAL_APP_URL ?? 'http://localhost:5175',
    invitationExpiresDays: Number(process.env.COMERCIAL_INVITATION_EXPIRES_DAYS ?? 7),
  },
  dashscope: {
    apiKey: optionalSecret('DASHSCOPE_API_KEY'),
    model: process.env.DASHSCOPE_VL_MODEL?.trim() || 'qwen3-vl-plus-2025-12-19',
    baseUrl:
      process.env.DASHSCOPE_BASE_URL?.trim() ||
      'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
  },
  gemini: {
    apiKey: optionalSecret('GEMINI_API_KEY'),
    model: process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash-lite',
  },
};

function optionalSecret(name: string): string {
  const value = (process.env[name] ?? '').trim();
  if (!value || value.startsWith('REEMPLAZAR')) {
    return '';
  }
  return value;
}
