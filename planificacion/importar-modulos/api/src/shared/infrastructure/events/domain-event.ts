export interface DomainEvent<TPayload = unknown> {
  type: string;
  payload: TPayload;
  /** Si está definido, el evento solo se envía a las conexiones de ese usuario. */
  targetUserId?: number;
  /** Si está definido, el evento solo se envía a las conexiones de ese cliente. */
  targetClienteId?: number;
}

export const RealtimeEvents = {
  DEPARTAMENTO_CREATED: 'departamento.created',
  DEPARTAMENTO_UPDATED: 'departamento.updated',
  DEPARTAMENTO_DELETED: 'departamento.deleted',

  ROL_CREATED: 'rol.created',
  ROL_UPDATED: 'rol.updated',
  ROL_DELETED: 'rol.deleted',

  CATEGORIA_CREATED: 'categoria.created',
  CATEGORIA_UPDATED: 'categoria.updated',
  CATEGORIA_DELETED: 'categoria.deleted',

  SUBCATEGORIA_CREATED: 'subcategoria.created',
  SUBCATEGORIA_UPDATED: 'subcategoria.updated',
  SUBCATEGORIA_DELETED: 'subcategoria.deleted',

  MARCA_CREATED: 'marca.created',
  MARCA_UPDATED: 'marca.updated',
  MARCA_DELETED: 'marca.deleted',

  PROVEEDOR_CREATED: 'proveedor.created',
  PROVEEDOR_UPDATED: 'proveedor.updated',
  PROVEEDOR_DELETED: 'proveedor.deleted',

  CLIENTE_CREATED: 'cliente.created',
  CLIENTE_UPDATED: 'cliente.updated',
  CLIENTE_DELETED: 'cliente.deleted',

  PRODUCTO_CREATED: 'producto.created',
  PRODUCTO_UPDATED: 'producto.updated',
  PRODUCTO_DELETED: 'producto.deleted',

  AJUSTE_INVENTARIO_CREATED: 'ajuste_inventario.created',
  AJUSTE_INVENTARIO_DELETED: 'ajuste_inventario.deleted',

  COMPRA_CREATED: 'compra.created',
  COMPRA_UPDATED: 'compra.updated',
  COMPRA_DELETED: 'compra.deleted',

  ORDEN_COMPRA_CREATED: 'orden_compra.created',
  ORDEN_COMPRA_UPDATED: 'orden_compra.updated',
  ORDEN_COMPRA_DELETED: 'orden_compra.deleted',

  COTIZACION_CREATED: 'cotizacion.created',
  COTIZACION_UPDATED: 'cotizacion.updated',
  COTIZACION_DELETED: 'cotizacion.deleted',

  DEVOLUCION_CREATED: 'devolucion.created',
  DEVOLUCION_UPDATED: 'devolucion.updated',
  DEVOLUCION_DELETED: 'devolucion.deleted',

  CANCELACION_CREATED: 'cancelacion.created',
  CANCELACION_UPDATED: 'cancelacion.updated',
  CANCELACION_DELETED: 'cancelacion.deleted',

  USUARIO_PREFERENCES_UPDATED: 'usuario.preferences.updated',
  USUARIO_CREATED: 'usuario.created',
  USUARIO_UPDATED: 'usuario.updated',
  USUARIO_DELETED: 'usuario.deleted',

  /** Carrito en vivo de Realizar Ventas 1 (app ↔ web). */
  VENTA_POS_CART_UPDATED: 'venta.pos.cart.updated',
  VENTA_POS_CART_CLEARED: 'venta.pos.cart.cleared',
  VENTA_POS_CART_REQUEST: 'venta.pos.cart.request',
  VENTA_POS_HEADER_UPDATED: 'venta.pos.header.updated',
  VENTA_POS_CODE_SUBMIT: 'venta.pos.code.submit',
  VENTA_POS_CODE_RESULT: 'venta.pos.code.result',
  VENTA_POS_SALE_PROCESSED: 'venta.pos.sale.processed',
  VENTA_POS_COBRO_REQUEST: 'venta.pos.cobro.request',
  VENTA_POS_COBRO_UPDATED: 'venta.pos.cobro.updated',
  VENTA_POS_COBRO_MONTO_UPDATED: 'venta.pos.cobro.monto.updated',
  VENTA_POS_COBRO_CONFIRM: 'venta.pos.cobro.confirm',
  VENTA_POS_COBRO_CLOSED: 'venta.pos.cobro.closed',

  CHAT_MENSAJE_CREADO: 'chat.mensaje.creado',
  CHAT_LECTURA_ACTUALIZADA: 'chat.lectura.actualizada',
  CHAT_CONVERSACION_ACTUALIZADA: 'chat.conversacion.actualizada',
  CHAT_PRESENCIA_ACTUALIZADA: 'chat.presencia.actualizada',

  WEBRTC_SIGNAL: 'webrtc.signal',

  NOTIFICATION_NEW: 'notification:new',

  TAREA_CREATED: 'tarea.created',
  TAREA_UPDATED: 'tarea.updated',
  TAREA_DELETED: 'tarea.deleted',
  TAREA_COMPLETADA: 'tarea.completada',
} as const;

/** Eventos que un cliente autenticado puede publicar por WebSocket para relay. */
export const ClientRelayRealtimeEvents = new Set<string>([
  RealtimeEvents.VENTA_POS_CART_UPDATED,
  RealtimeEvents.VENTA_POS_CART_CLEARED,
  RealtimeEvents.VENTA_POS_CART_REQUEST,
  RealtimeEvents.VENTA_POS_HEADER_UPDATED,
  RealtimeEvents.VENTA_POS_CODE_SUBMIT,
  RealtimeEvents.VENTA_POS_CODE_RESULT,
  RealtimeEvents.VENTA_POS_SALE_PROCESSED,
  RealtimeEvents.VENTA_POS_COBRO_REQUEST,
  RealtimeEvents.VENTA_POS_COBRO_UPDATED,
  RealtimeEvents.VENTA_POS_COBRO_MONTO_UPDATED,
  RealtimeEvents.VENTA_POS_COBRO_CONFIRM,
  RealtimeEvents.VENTA_POS_COBRO_CLOSED,
]);

/** Señalización WebRTC: se reenvía a los demás participantes de la conversación. */
export const SignalingRealtimeEvents = new Set<string>([RealtimeEvents.WEBRTC_SIGNAL]);

export type RealtimeEventType = (typeof RealtimeEvents)[keyof typeof RealtimeEvents];
