"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserPresence = addUserPresence;
exports.removeUserPresence = removeUserPresence;
exports.isUserOnline = isUserOnline;
exports.getOnlineUserIds = getOnlineUserIds;
exports.areUsersOnline = areUsersOnline;
exports.addClientePresence = addClientePresence;
exports.removeClientePresence = removeClientePresence;
exports.isClienteOnline = isClienteOnline;
const connectionCounts = new Map();
const clienteConnectionCounts = new Map();
function addUserPresence(userId) {
    if (!Number.isInteger(userId) || userId <= 0) {
        return false;
    }
    const next = (connectionCounts.get(userId) ?? 0) + 1;
    connectionCounts.set(userId, next);
    return next === 1;
}
function removeUserPresence(userId) {
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
function isUserOnline(userId) {
    return (connectionCounts.get(userId) ?? 0) > 0;
}
function getOnlineUserIds() {
    return [...connectionCounts.keys()];
}
function areUsersOnline(userIds) {
    const result = new Map();
    for (const id of userIds) {
        result.set(id, isUserOnline(id));
    }
    return result;
}
function addClientePresence(clienteId) {
    if (!Number.isInteger(clienteId) || clienteId <= 0) {
        return false;
    }
    const next = (clienteConnectionCounts.get(clienteId) ?? 0) + 1;
    clienteConnectionCounts.set(clienteId, next);
    return next === 1;
}
function removeClientePresence(clienteId) {
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
function isClienteOnline(clienteId) {
    return (clienteConnectionCounts.get(clienteId) ?? 0) > 0;
}
//# sourceMappingURL=presence.js.map