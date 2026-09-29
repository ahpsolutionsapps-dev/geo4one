import { useCallback, useEffect, useState } from "react";

import { ColocacionesApi, colocacionesApi } from "../data/colocaciones.api";
import { Colocacion, ColocacionFormValues } from "../colocaciones.types";

function sortItems(items: Colocacion[]): Colocacion[] {
  return [...items].sort((a, b) =>
    a.codigoSeguimiento.localeCompare(b.codigoSeguimiento, "es", {
      sensitivity: "base",
    }),
  );
}

interface UseColocacionesOptions {
  api?: ColocacionesApi;
  entityPluralLabel?: string;
}

export function useColocaciones({
  api = colocacionesApi,
  entityPluralLabel = "colocaciones",
}: UseColocacionesOptions = {}) {
  const [colocaciones, setColocaciones] = useState<Colocacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadColocaciones = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const items = await api.getColocaciones();
      setColocaciones(sortItems(items));
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : `No se pudieron cargar los ${entityPluralLabel}`,
      );
    } finally {
      setIsLoading(false);
    }
  }, [api, entityPluralLabel]);

  useEffect(() => {
    void loadColocaciones();
  }, [loadColocaciones]);

  const saveColocacion = useCallback(
    async (id: string | null, values: ColocacionFormValues) => {
      if (id) {
        await api.updateColocacion(id, values);
      } else {
        await api.createColocacion(values);
      }

      await loadColocaciones();
    },
    [api, loadColocaciones],
  );

  const deleteColocacion = useCallback(
    async (id: string) => {
      await api.deleteColocacion(id);
      await loadColocaciones();
    },
    [api, loadColocaciones],
  );

  return {
    colocaciones,
    isLoading,
    errorMessage,
    reload: loadColocaciones,
    saveColocacion,
    deleteColocacion,
  };
}
