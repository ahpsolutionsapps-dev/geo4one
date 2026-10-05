import { ApplicationEvent } from '../../../../shared/infrastructure/events/application-event';

type NotificationPayload = {
  idNegocio: number;
  idSucursal?: number | null;
  idEntidad: number;
  entidad: string;
  idUsuarioOrigen?: number | null;
  idProducto: number;
  nombreProducto: string;
  existenciaActual: number;
  stockMinimo: number;
  metadata?: Record<string, unknown>;
};

export function productoAgotadoEvent(
  payload: NotificationPayload,
): ApplicationEvent<NotificationPayload> {
  return {
    eventName: 'producto.agotado',
    occurredAt: new Date(),
    payload,
  };
}

export function stockBajoEvent(
  payload: NotificationPayload,
): ApplicationEvent<NotificationPayload> {
  return {
    eventName: 'producto.stock.bajo',
    occurredAt: new Date(),
    payload,
  };
}