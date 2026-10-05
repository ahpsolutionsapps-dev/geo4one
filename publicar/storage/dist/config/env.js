"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("./load-env");
const load_env_1 = require("./load-env");
function required(name, fallback) {
    const value = process.env[name] ?? fallback;
    if (value === undefined || value === '') {
        throw new Error(`Variable de entorno faltante: ${name}`);
    }
    return value;
}
function parseList(value) {
    return value
        .split(',')
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean);
}
const adminToken = required('ADMIN_TOKEN', load_env_1.runtimeEnv === 'production' ? undefined : 'change-me-admin-token');
const jwtSecret = required('JWT_SECRET', load_env_1.runtimeEnv === 'production' ? undefined : 'change-me-jwt-secret');
const insecureDefaults = [
    'change-me-admin-token',
    'change-me-jwt-secret',
    'REEMPLAZAR_CON_TOKEN_SEGURO_EN_PRODUCCION',
    'REEMPLAZAR_CON_SECRETO_SEGURO_EN_PRODUCCION',
];
if (load_env_1.runtimeEnv === 'production') {
    if (insecureDefaults.includes(adminToken)) {
        throw new Error('ADMIN_TOKEN debe configurarse con un valor seguro en producción');
    }
    if (insecureDefaults.includes(jwtSecret)) {
        throw new Error('JWT_SECRET debe configurarse con un valor seguro en producción');
    }
}
exports.env = {
    nodeEnv: load_env_1.runtimeEnv,
    isProduction: load_env_1.runtimeEnv === 'production',
    isDevelopment: load_env_1.runtimeEnv === 'development',
    port: Number(process.env.PORT ?? 4000),
    databaseUrl: required('DATABASE_URL'),
    storagePath: required('STORAGE_PATH', './storage'),
    maxFileSize: Number(process.env.MAX_FILE_SIZE ?? 10 * 1024 * 1024),
    allowedExtensions: parseList(process.env.ALLOWED_EXTENSIONS ??
        'jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx,txt,zip'),
    allowedMimeTypes: parseList(process.env.ALLOWED_MIME_TYPES ??
        'image/jpeg,image/png,image/gif,application/pdf,text/plain,application/zip'),
    apiKeyHeader: process.env.API_KEY_HEADER ?? 'X-API-KEY',
    publicUrl: required('PUBLIC_URL', 'http://localhost:4000'),
    adminToken,
    jwt: {
        secret: jwtSecret,
        expiresIn: (process.env.JWT_EXPIRES_IN ?? '1d'),
    },
    corsOrigin: process.env.CORS_ORIGIN ?? '*',
    rateLimit: {
        windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000),
        max: Number(process.env.RATE_LIMIT_MAX ?? 100),
    },
    enableDuplicateDetection: process.env.ENABLE_DUPLICATE_DETECTION !== 'false',
    enableFileValidation: process.env.ENABLE_FILE_VALIDATION !== 'false',
    signedUrlExpirationMinutes: Number(process.env.SIGNED_URL_EXPIRATION_MINUTES ?? 60),
    enableCompression: process.env.ENABLE_COMPRESSION !== 'false',
    logLevel: process.env.LOG_LEVEL ?? 'info',
};
//# sourceMappingURL=env.js.map