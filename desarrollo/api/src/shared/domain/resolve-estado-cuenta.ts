export type EstadoCuentaNombre =
  | 'Pendiente'
  | 'Parcial'
  | 'Pagada'
  | 'Vencida';

export function resolveEstadoCuenta(
  balancePendiente: number,
  fechaVencimiento?: Date | null,
  montoOriginal?: number,
): EstadoCuentaNombre {
  if (balancePendiente <= 0.00001) {
    return 'Pagada';
  }

  if (fechaVencimiento) {
    const today = new Date();
    const fechaHoy = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const fechaVence = new Date(
      fechaVencimiento.getFullYear(),
      fechaVencimiento.getMonth(),
      fechaVencimiento.getDate(),
    );

    if (fechaHoy > fechaVence) {
      return 'Vencida';
    }
  }

  if (
    typeof montoOriginal === 'number' &&
    balancePendiente < montoOriginal - 0.00001
  ) {
    return 'Parcial';
  }

  return 'Pendiente';
}
