"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.domainEventBus = void 0;
const node_events_1 = require("node:events");
class DomainEventBus extends node_events_1.EventEmitter {
    publish(event) {
        this.emit('event', event);
        this.emit(event.type, event.payload);
    }
}
exports.domainEventBus = new DomainEventBus();
//# sourceMappingURL=domain-event-bus.js.map