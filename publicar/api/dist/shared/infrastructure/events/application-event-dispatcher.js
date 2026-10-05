"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationEventDispatcher = void 0;
exports.getApplicationEventDispatcher = getApplicationEventDispatcher;
exports.resetApplicationEventDispatcherForTests = resetApplicationEventDispatcherForTests;
class ApplicationEventDispatcher {
    handlers = new Map();
    register(eventName, handler) {
        const list = this.handlers.get(eventName) ?? [];
        list.push(handler);
        this.handlers.set(eventName, list);
    }
    registerAll(eventNames, handler) {
        for (const eventName of eventNames) {
            this.register(eventName, handler);
        }
    }
    async dispatch(event) {
        const handlers = this.handlers.get(event.eventName) ?? [];
        await Promise.all(handlers.map((handler) => handler(event)));
    }
}
exports.ApplicationEventDispatcher = ApplicationEventDispatcher;
let dispatcherInstance = null;
function getApplicationEventDispatcher() {
    if (!dispatcherInstance) {
        dispatcherInstance = new ApplicationEventDispatcher();
    }
    return dispatcherInstance;
}
function resetApplicationEventDispatcherForTests() {
    dispatcherInstance = null;
}
//# sourceMappingURL=application-event-dispatcher.js.map