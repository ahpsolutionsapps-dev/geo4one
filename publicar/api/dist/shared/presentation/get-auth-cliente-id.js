"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthClienteId = getAuthClienteId;
const app_error_1 = require("../../core/errors/app-error");
function getAuthClienteId(req) {
    if (req.auth?.actor !== 'cliente') {
        throw new app_error_1.UnauthorizedError('Token de cliente requerido');
    }
    const fromClaim = req.auth.idCliente;
    if (typeof fromClaim === 'number' && Number.isInteger(fromClaim) && fromClaim > 0) {
        return fromClaim;
    }
    const sub = req.auth.sub ?? '';
    const match = /^c:(\d+)$/.exec(sub);
    const idCliente = match ? Number(match[1]) : Number.NaN;
    if (!Number.isInteger(idCliente) || idCliente <= 0) {
        throw new app_error_1.UnauthorizedError('Token inválido');
    }
    return idCliente;
}
//# sourceMappingURL=get-auth-cliente-id.js.map