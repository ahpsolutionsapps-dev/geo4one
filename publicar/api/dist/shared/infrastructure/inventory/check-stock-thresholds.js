"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkStockThresholds = checkStockThresholds;
const notification_events_1 = require("../../../features/notificaciones/domain/events/notification-events");
async function checkStockThresholds(prisma, dispatcher, params) {
    const prismaAny = prisma;
    const producto = await prismaAny.productos.findUnique({
        where: { IdProducto: params.idProducto },
        select: {
            Nombre: true,
            InventarioExistencias: {
                select: { StockActual: true, StockMinimo: true },
            },
        },
    });
    if (!producto?.InventarioExistencias) {
        return;
    }
    const existenciaActual = Number(producto.InventarioExistencias.StockActual);
    const stockMinimo = Number(producto.InventarioExistencias.StockMinimo);
    const nombreProducto = producto.Nombre;
    const basePayload = {
        idNegocio: params.idNegocio,
        idSucursal: params.idSucursal ?? null,
        idEntidad: params.idProducto,
        entidad: 'Producto',
        idUsuarioOrigen: params.idUsuarioOrigen ?? null,
        idProducto: params.idProducto,
        nombreProducto,
        existenciaActual,
        stockMinimo,
        metadata: { nombreProducto, existenciaActual, stockMinimo },
    };
    if (existenciaActual <= 0) {
        await dispatcher.dispatch((0, notification_events_1.productoAgotadoEvent)(basePayload));
        return;
    }
    if (stockMinimo > 0 && existenciaActual <= stockMinimo) {
        await dispatcher.dispatch((0, notification_events_1.stockBajoEvent)(basePayload));
    }
}
//# sourceMappingURL=check-stock-thresholds.js.map