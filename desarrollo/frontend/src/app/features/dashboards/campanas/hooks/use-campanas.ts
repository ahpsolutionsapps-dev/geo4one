import { useCallback, useEffect, useState } from "react";

import { campanasApi } from "../data/campanas.api";
import { Campana, CampanaFormValues } from "../campanas.types";

function sortItems(items: Campana[]): Campana[] {
  return [...items].sort((a, b) =>
    a.versionCampana.localeCompare(b.versionCampana, "es", { sensitivity: "base" }),
  );
}

export function useCampanas() {
  const [campanas, setCampanas] = useState<Campana[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadCampanas = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const items = await campanasApi.getCampanas();
      setCampanas(sortItems(items));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "No se pudieron cargar las campanas",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCampanas();
  }, [loadCampanas]);

  const saveCampana = useCallback(
    async (id: string | null, values: CampanaFormValues) => {
      if (id) {
        await campanasApi.updateCampana(id, values);
      } else {
        await campanasApi.createCampana(values);
      }

      await loadCampanas();
    },
    [loadCampanas],
  );

  const deleteCampana = useCallback(
    async (id: string) => {
      await campanasApi.deleteCampana(id);
      await loadCampanas();
    },
    [loadCampanas],
  );

  return {
    campanas,
    isLoading,
    errorMessage,
    reload: loadCampanas,
    saveCampana,
    deleteCampana,
  };
}
