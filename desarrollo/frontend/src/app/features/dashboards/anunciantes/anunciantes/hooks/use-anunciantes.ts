import { useCallback, useEffect, useState } from "react";

import { anunciantesApi } from "../data/anunciantes.api";
import { Anunciante, AnuncianteFormValues } from "../anunciantes.types";

function sortItems(items: Anunciante[]): Anunciante[] {
  return [...items].sort((a, b) =>
    a.anunciante.localeCompare(b.anunciante, "es", { sensitivity: "base" }),
  );
}

export function useAnunciantes() {
  const [anunciantes, setAnunciantes] = useState<Anunciante[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadAnunciantes = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const items = await anunciantesApi.getAnunciantes();
      setAnunciantes(sortItems(items));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "No se pudieron cargar los anunciantes",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAnunciantes();
  }, [loadAnunciantes]);

  const saveAnunciante = useCallback(
    async (id: string | null, values: AnuncianteFormValues) => {
      if (id) {
        await anunciantesApi.updateAnunciante(id, values);
      } else {
        await anunciantesApi.createAnunciante(values);
      }

      await loadAnunciantes();
    },
    [loadAnunciantes],
  );

  const deleteAnunciante = useCallback(
    async (id: string) => {
      await anunciantesApi.deleteAnunciante(id);
      await loadAnunciantes();
    },
    [loadAnunciantes],
  );

  return {
    anunciantes,
    isLoading,
    errorMessage,
    reload: loadAnunciantes,
    saveAnunciante,
    deleteAnunciante,
  };
}
