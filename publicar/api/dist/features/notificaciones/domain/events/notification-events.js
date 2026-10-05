"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productoAgotadoEvent = productoAgotadoEvent;
exports.stockBajoEvent = stockBajoEvent;
function productoAgotadoEvent(payload) {
    return {
        eventName: 'producto.agotado',
        occurredAt: new Date(),
        payload,
    };
}
function stockBajoEvent(payload) {
    return {
        eventName: 'producto.stock.bajo',
        occurredAt: new Date(),
        payload,
    };
}
//# sourceMappingURL=notification-events.js.map