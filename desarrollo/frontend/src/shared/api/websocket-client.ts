export const RealtimeEvents = {
  ROL_CREATED: "roles.created",
  ROL_UPDATED: "roles.updated",
  ROL_DELETED: "roles.deleted",
  USUARIO_CREATED: "usuarios.created",
  USUARIO_UPDATED: "usuarios.updated",
  USUARIO_DELETED: "usuarios.deleted",
} as const;

export type RealtimeEvent =
  (typeof RealtimeEvents)[keyof typeof RealtimeEvents];

export function getRealtimeBrowserEventName(event: RealtimeEvent): string {
  return `realtime:${event}`;
}

export function emitRealtimeEvent(event: RealtimeEvent): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(getRealtimeBrowserEventName(event), { detail: { event } }),
  );
}
