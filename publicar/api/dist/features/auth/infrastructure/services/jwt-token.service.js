"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtTokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_error_1 = require("../../../../core/errors/app-error");
class JwtTokenService {
    secret;
    expiresIn;
    constructor(secret, expiresIn = '1d') {
        this.secret = secret;
        this.expiresIn = expiresIn;
    }
    sign(payload) {
        return jsonwebtoken_1.default.sign(payload, this.secret, { expiresIn: this.expiresIn });
    }
    verify(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.secret);
            if (typeof decoded === 'string') {
                throw new app_error_1.UnauthorizedError('Token inválido');
            }
            const { sub, username, actor, idCliente, idAgente } = decoded;
            if (typeof sub !== 'string' || typeof username !== 'string') {
                throw new app_error_1.UnauthorizedError('Token inválido');
            }
            const resolvedActor = actor === 'cliente'
                ? 'cliente'
                : actor === 'plataforma'
                    ? 'plataforma'
                    : 'usuario';
            const resolvedClienteId = typeof idCliente === 'number' && Number.isInteger(idCliente) && idCliente > 0
                ? idCliente
                : undefined;
            const resolvedAgenteId = typeof idAgente === 'number' && Number.isInteger(idAgente) && idAgente > 0
                ? idAgente
                : undefined;
            return {
                sub,
                username,
                actor: resolvedActor,
                ...(resolvedClienteId ? { idCliente: resolvedClienteId } : {}),
                ...(resolvedAgenteId ? { idAgente: resolvedAgenteId } : {}),
            };
        }
        catch (err) {
            if (err instanceof app_error_1.UnauthorizedError)
                throw err;
            throw new app_error_1.UnauthorizedError('Token inválido o expirado');
        }
    }
}
exports.JwtTokenService = JwtTokenService;
//# sourceMappingURL=jwt-token.service.js.map