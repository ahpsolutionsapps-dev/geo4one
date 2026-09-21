import { domainEventBus } from './domain-event-bus';
import { DomainEvent } from './domain-event';

export function publishRealtimeEvent<TPayload>(
  type: string,
  payload: TPayload,
): void {
  const event: DomainEvent<TPayload> = { type, payload };
  domainEventBus.publish(event);
}

export function publishRealtimeEventToUser<TPayload>(
  userId: number,
  type: string,
  payload: TPayload,
): void {
  const event: DomainEvent<TPayload> = {
    type,
    payload,
    targetUserId: userId,
  };
  domainEventBus.publish(event);
}

export function publishRealtimeEventToUsers<TPayload>(
  userIds: number[],
  type: string,
  payload: TPayload,
): void {
  const uniqueIds = [...new Set(userIds.filter((id) => Number.isInteger(id) && id > 0))];
  for (const userId of uniqueIds) {
    publishRealtimeEventToUser(userId, type, payload);
  }
}

export function publishRealtimeEventToCliente<TPayload>(
  clienteId: number,
  type: string,
  payload: TPayload,
): void {
  const event: DomainEvent<TPayload> = {
    type,
    payload,
    targetClienteId: clienteId,
  };
  domainEventBus.publish(event);
}

export function publishRealtimeEventToClientes<TPayload>(
  clienteIds: number[],
  type: string,
  payload: TPayload,
): void {
  const uniqueIds = [...new Set(clienteIds.filter((id) => Number.isInteger(id) && id > 0))];
  for (const clienteId of uniqueIds) {
    publishRealtimeEventToCliente(clienteId, type, payload);
  }
}

export function publishRealtimeEventToChatParticipants<TPayload>(
  userIds: number[],
  clienteIds: number[],
  type: string,
  payload: TPayload,
): void {
  publishRealtimeEventToUsers(userIds, type, payload);
  publishRealtimeEventToClientes(clienteIds, type, payload);
}
