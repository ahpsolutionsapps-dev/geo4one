import { useCallback, useEffect, useState } from "react";

import { periodosColocacionApi } from "../data/periodos-colocacion.api";
import {
  PeriodoColocacion,
  PeriodoColocacionFormValues,
} from "../periodos-colocacion.types";

function sortPeriodosColocacion(items: PeriodoColocacion[]): PeriodoColocacion[] {
  return [...items].sort((a, b) => {
    if (a.fechaInicial === b.fechaInicial) {
      return b.fechaFinal.localeCompare(a.fechaFinal);
    }

    return b.fechaInicial.localeCompare(a.fechaInicial);
  });
}

export function usePeriodosColocacion() {
  const [periodosColocacion, setPeriodosColocacion] = useState<PeriodoColocacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadPeriodosColocacion = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const items = await periodosColocacionApi.getPeriodosColocacion();
      setPeriodosColocacion(sortPeriodosColocacion(items));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "No se pudieron cargar los periodos de colocación",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPeriodosColocacion();
  }, [loadPeriodosColocacion]);

  const savePeriodoColocacion = useCallback(
    async (id: string | null, values: PeriodoColocacionFormValues) => {
      if (id) {
        await periodosColocacionApi.updatePeriodoColocacion(id, values);
      } else {
        await periodosColocacionApi.createPeriodoColocacion(values);
      }

      await loadPeriodosColocacion();
    },
    [loadPeriodosColocacion],
  );

  const deletePeriodoColocacion = useCallback(
    async (id: string) => {
      await periodosColocacionApi.deletePeriodoColocacion(id);
      await loadPeriodosColocacion();
    },
    [loadPeriodosColocacion],
  );

  return {
    periodosColocacion,
    isLoading,
    errorMessage,
    reload: loadPeriodosColocacion,
    savePeriodoColocacion,
    deletePeriodoColocacion,
  };
}
