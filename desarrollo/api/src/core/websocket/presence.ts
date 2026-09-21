const connectionCounts = new Map<number, number>();
const clienteConnectionCounts = new Map<number, number>();

export function addUserPresence(userId: number): boolean {
  if (!Number.isInteger(userId) || userId <= 0) {
    return false;
  }

  const next = (connectionCounts.get(userId) ?? 0) + 1;
  connectionCounts.set(userId, next);
  return next === 1;
}

export function removeUserPresence(userId: number): boolean {
  if (!Number.isInteger(userId) || userId <= 0) {
    return false;
  }

  const current = connectionCounts.get(userId) ?? 0;
  if (current <= 1) {
    connectionCounts.delete(userId);
    return current === 1;
  }

  connectionCounts.set(userId, current - 1);
  return false;
}

export function isUserOnline(userId: number): boolean {
  return (connectionCounts.get(userId) ?? 0) > 0;
}

export function getOnlineUserIds(): number[] {
  return [...connectionCounts.keys()];
}

export function areUsersOnline(userIds: number[]): Map<number, boolean> {
  const result = new Map<number, boolean>();
  for (const id of userIds) {
    result.set(id, isUserOnline(id));
  }
  return result;
}

export function addClientePresence(clienteId: number): boolean {
  if (!Number.isInteger(clienteId) || clienteId <= 0) {
    return false;
  }

  const next = (clienteConnectionCounts.get(clienteId) ?? 0) + 1;
  clienteConnectionCounts.set(clienteId, next);
  return next === 1;
}

export function removeClientePresence(clienteId: number): boolean {
  if (!Number.isInteger(clienteId) || clienteId <= 0) {
    return false;
  }

  const current = clienteConnectionCounts.get(clienteId) ?? 0;
  if (current <= 1) {
    clienteConnectionCounts.delete(clienteId);
    return current === 1;
  }

  clienteConnectionCounts.set(clienteId, current - 1);
  return false;
}

export function isClienteOnline(clienteId: number): boolean {
  return (clienteConnectionCounts.get(clienteId) ?? 0) > 0;
}
