import { useCallback, useEffect, useState } from "react";

import { useWebSocketEvent } from "@/hooks/useWebSocketEvent";
import { RealtimeEvents } from "@/shared/api/websocket-client";

import { Usuario } from "../../domain/entities/usuario.entity";
import { usuariosModule } from "../../di/usuarios.module";

function sortUsuarios(items: Usuario[]): Usuario[] {
  return [...items].sort((a, b) =>
    a.username.localeCompare(b.username, "es", { sensitivity: "base" }),
  );
}

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadUsuarios = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const items = await usuariosModule.getUsuarios.execute();
      setUsuarios(sortUsuarios(items));
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los usuarios",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsuarios();
  }, [loadUsuarios]);

  const refreshUsuarios = useCallback(() => {
    void loadUsuarios();
  }, [loadUsuarios]);

  useWebSocketEvent(RealtimeEvents.USUARIO_CREATED, refreshUsuarios);
  useWebSocketEvent(RealtimeEvents.USUARIO_UPDATED, refreshUsuarios);
  useWebSocketEvent(RealtimeEvents.USUARIO_DELETED, refreshUsuarios);

  const anularUsuario = useCallback(
    async (id: string) => {
      await usuariosModule.anularUsuario.execute(id);
      await loadUsuarios();
    },
    [loadUsuarios],
  );

  return {
    usuarios,
    isLoading,
    errorMessage,
    reload: loadUsuarios,
    anularUsuario,
  };
}
