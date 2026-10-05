"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const app_error_1 = require("../../../../core/errors/app-error");
function authMiddleware(tokens) {
    return (req, _res, next) => {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
            return next(new app_error_1.UnauthorizedError('Token no provisto'));
        }
        try {
            const token = header.slice('Bearer '.length).trim();
            const payload = tokens.verify(token);
            if (payload.actor === 'cliente' || payload.actor === 'plataforma') {
                return next(new app_error_1.UnauthorizedError('Token de usuario requerido'));
            }
            req.auth = payload;
            next();
        }
        catch (err) {
            next(err);
        }
    };
}
//# sourceMappingURL=auth.middleware.js.map