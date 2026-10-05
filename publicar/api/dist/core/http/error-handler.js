"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const app_error_1 = require("../errors/app-error");
function errorHandler(err, _req, res, _next) {
    if (err instanceof zod_1.ZodError) {
        res.status(422).json({
            code: 'VALIDATION_ERROR',
            message: 'Datos inválidos',
            details: err.flatten(),
        });
        return;
    }
    if (err instanceof app_error_1.AppError) {
        res.status(err.statusCode).json({
            code: err.code,
            message: err.message,
        });
        return;
    }
    // eslint-disable-next-line no-console
    console.error('[unhandled error]', err);
    res.status(500).json({
        code: 'INTERNAL_ERROR',
        message: 'Error interno del servidor',
    });
}
//# sourceMappingURL=error-handler.js.map