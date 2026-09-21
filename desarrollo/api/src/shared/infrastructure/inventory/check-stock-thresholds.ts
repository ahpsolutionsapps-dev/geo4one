import { PrismaClient } from '@prisma/client';
import { ApplicationEventDispatcher } from '../events/application-event-dispatcher';
import {
  productoAgotadoEvent,
  stockBajoEvent,
} from '../../../features/notificaciones/domain/events/notification-events';

export async function checkStockThresholds(
  prisma: PrismaClient,
  dispatcher: ApplicationEventDispatcher,
  params: {
    idProducto: number;
    idNegocio: number;
    idSucursal?: number | null;
    idUsuarioOrigen?: number | null;
  },
): Promise<void> {
  const producto = await prisma.productos.findUnique({
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
    await dispatcher.dispatch(productoAgotadoEvent(basePayload));
    return;
  }

  if (stockMinimo > 0 && existenciaActual <= stockMinimo) {
    await dispatcher.dispatch(stockBajoEvent(basePayload));
  }
}
