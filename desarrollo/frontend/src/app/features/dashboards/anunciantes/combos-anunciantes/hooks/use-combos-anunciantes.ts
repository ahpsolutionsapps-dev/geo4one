import { useCallback, useEffect, useState } from "react";

import { combosAnunciantesApi } from "../data/combos-anunciantes.api";
import {
  ComboAnunciante,
  ComboAnuncianteFormValues,
} from "../combos-anunciantes.types";

function sortCombos(items: ComboAnunciante[]): ComboAnunciante[] {
  return [...items].sort((a, b) =>
    a.comboAnunciante.localeCompare(b.comboAnunciante, "es", { sensitivity: "base" }),
  );
}

export function useCombosAnunciantes() {
  const [combosAnunciantes, setCombosAnunciantes] = useState<ComboAnunciante[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadCombosAnunciantes = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const items = await combosAnunciantesApi.getCombosAnunciantes();
      setCombosAnunciantes(sortCombos(items));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudieron cargar los combos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCombosAnunciantes();
  }, [loadCombosAnunciantes]);

  const saveComboAnunciante = useCallback(
    async (id: string | null, values: ComboAnuncianteFormValues) => {
      if (id) {
        await combosAnunciantesApi.updateComboAnunciante(id, values);
      } else {
        await combosAnunciantesApi.createComboAnunciante(values);
      }

      await loadCombosAnunciantes();
    },
    [loadCombosAnunciantes],
  );

  const deleteComboAnunciante = useCallback(
    async (id: string) => {
      await combosAnunciantesApi.deleteComboAnunciante(id);
      await loadCombosAnunciantes();
    },
    [loadCombosAnunciantes],
  );

  return {
    combosAnunciantes,
    isLoading,
    errorMessage,
    reload: loadCombosAnunciantes,
    saveComboAnunciante,
    deleteComboAnunciante,
  };
}
