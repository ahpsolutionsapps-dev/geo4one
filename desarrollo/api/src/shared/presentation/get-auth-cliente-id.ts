import { Request } from 'express';
import { UnauthorizedError } from '../../core/errors/app-error';

export function getAuthClienteId(req: Request): number {
  if (req.auth?.actor !== 'cliente') {
    throw new UnauthorizedError('Token de cliente requerido');
  }

  const fromClaim = req.auth.idCliente;
  if (typeof fromClaim === 'number' && Number.isInteger(fromClaim) && fromClaim > 0) {
    return fromClaim;
  }

  const sub = req.auth.sub ?? '';
  const match = /^c:(\d+)$/.exec(sub);
  const idCliente = match ? Number(match[1]) : Number.NaN;
  if (!Number.isInteger(idCliente) || idCliente <= 0) {
    throw new UnauthorizedError('Token inválido');
  }

  return idCliente;
}
