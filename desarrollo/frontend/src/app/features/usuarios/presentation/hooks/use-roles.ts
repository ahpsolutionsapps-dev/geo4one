import { useCallback, useEffect, useState } from "react";

import { useWebSocketEvent } from "@/hooks/useWebSocketEvent";
import { RealtimeEvents } from "@/shared/api/websocket-client";

import { Rol } from "../../domain/entities/rol.entity";
import { usuariosModule } from "../../di/usuarios.module";

function sortRoles(items: Rol[]): Rol[] {
  return [...items].sort((a, b) =>
    a.rol.localeCompare(b.rol, "es", { sensitivity: "base" }),
  );
}

export function useRoles() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadRoles = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;

    if (!silent) {
      setIsLoading(true);
      setErrorMessage(null);
    }

    try {
      const items = await usuariosModule.getRoles.execute();
      setRoles(sortRoles(items));
    } catch (error) {
      if (!silent) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los roles",
        );
      }
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, []);

  const refreshRoles = useCallback(() => {
    void loadRoles({ silent: true });
  }, [loadRoles]);

  useEffect(() => {
    void loadRoles();
  }, [loadRoles]);

  useWebSocketEvent(RealtimeEvents.ROL_CREATED, refreshRoles);
  useWebSocketEvent(RealtimeEvents.ROL_UPDATED, refreshRoles);
  useWebSocketEvent(RealtimeEvents.ROL_DELETED, refreshRoles);

  return {
    roles,
    isLoading,
    errorMessage,
    reload: () => loadRoles({ silent: true }),
  };
}
