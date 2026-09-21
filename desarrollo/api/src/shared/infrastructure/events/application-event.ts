export interface ApplicationEventPayload {
  idNegocio: number;
  idSucursal?: number | null;
  idEntidad: number;
  entidad: string;
  idUsuarioOrigen?: number | null;
  metadata?: Record<string, unknown>;
  fechaReferencia?: string;
  idempotencyKey?: string;
}

export interface ApplicationEvent<TPayload extends ApplicationEventPayload = ApplicationEventPayload> {
  eventName: string;
  occurredAt: Date;
  payload: TPayload;
}

export type ApplicationEventHandler = (event: ApplicationEvent) => void | Promise<void>;
