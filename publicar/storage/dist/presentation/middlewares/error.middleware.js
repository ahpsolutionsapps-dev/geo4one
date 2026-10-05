"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.asyncHandler = asyncHandler;
const zod_1 = require("zod");
const app_error_1 = require("../../shared/errors/app-error");
const logger_1 = require("../../infrastructure/security/logger");
function errorHandler(err, _req, res, _next) {
    if (err instanceof zod_1.ZodError) {
        res.status(422).json({
            success: false,
            message: 'Datos inválidos',
            errors: err.flatten(),
        });
        return;
    }
    if (err instanceof app_error_1.AppError) {
        if (err.statusCode >= 500) {
            logger_1.logger.error(err.message, { code: err.code, stack: err.stack });
        }
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            code: err.code,
        });
        return;
    }
    logger_1.logger.error('Error no controlado', { error: err });
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
    });
}
function asyncHandler(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}
//# sourceMappingURL=error.middleware.js.map