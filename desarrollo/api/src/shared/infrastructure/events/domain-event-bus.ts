import { EventEmitter } from 'node:events';

import { DomainEvent } from './domain-event';

class DomainEventBus extends EventEmitter {
  publish<TPayload>(event: DomainEvent<TPayload>): void {
    this.emit('event', event);
    this.emit(event.type, event.payload);
  }
}

export const domainEventBus = new DomainEventBus();
