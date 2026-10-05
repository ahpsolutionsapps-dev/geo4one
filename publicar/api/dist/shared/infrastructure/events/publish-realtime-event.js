"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishRealtimeEvent = publishRealtimeEvent;
exports.publishRealtimeEventToUser = publishRealtimeEventToUser;
exports.publishRealtimeEventToUsers = publishRealtimeEventToUsers;
exports.publishRealtimeEventToCliente = publishRealtimeEventToCliente;
exports.publishRealtimeEventToClientes = publishRealtimeEventToClientes;
exports.publishRealtimeEventToChatParticipants = publishRealtimeEventToChatParticipants;
const domain_event_bus_1 = require("./domain-event-bus");
function publishRealtimeEvent(type, payload) {
    const event = { type, payload };
    domain_event_bus_1.domainEventBus.publish(event);
}
function publishRealtimeEventToUser(userId, type, payload) {
    const event = {
        type,
        payload,
        targetUserId: userId,
    };
    domain_event_bus_1.domainEventBus.publish(event);
}
function publishRealtimeEventToUsers(userIds, type, payload) {
    const uniqueIds = [...new Set(userIds.filter((id) => Number.isInteger(id) && id > 0))];
    for (const userId of uniqueIds) {
        publishRealtimeEventToUser(userId, type, payload);
    }
}
function publishRealtimeEventToCliente(clienteId, type, payload) {
    const event = {
        type,
        payload,
        targetClienteId: clienteId,
    };
    domain_event_bus_1.domainEventBus.publish(event);
}
function publishRealtimeEventToClientes(clienteIds, type, payload) {
    const uniqueIds = [...new Set(clienteIds.filter((id) => Number.isInteger(id) && id > 0))];
    for (const clienteId of uniqueIds) {
        publishRealtimeEventToCliente(clienteId, type, payload);
    }
}
function publishRealtimeEventToChatParticipants(userIds, clienteIds, type, payload) {
    publishRealtimeEventToUsers(userIds, type, payload);
    publishRealtimeEventToClientes(clienteIds, type, payload);
}
//# sourceMappingURL=publish-realtime-event.js.map