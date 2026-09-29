import { useCallback, useEffect, useState } from "react";

import { marcasAguaApi } from "../data/marcas-agua.api";
import {
  MarcaAguaSeguimiento,
  MarcaAguaSeguimientoFormValues,
} from "../marcas-agua.types";

function sortItems(items: MarcaAguaSeguimiento[]): MarcaAguaSeguimiento[] {
  return [...items].sort((a, b) =>
    a.versionCampana.localeCompare(b.versionCampana, "es", { sensitivity: "base" }),
  );
}

export function useMarcasAguaSeguimiento() {
  const [marcasAgua, setMarcasAgua] = useState<MarcaAguaSeguimiento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadMarcasAgua = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const items = await marcasAguaApi.getMarcasAguaSeguimiento();
      setMarcasAgua(sortItems(items));
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar las marcas de agua",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMarcasAgua();
  }, [loadMarcasAgua]);

  const saveMarcaAgua = useCallback(
    async (id: string | null, values: MarcaAguaSeguimientoFormValues) => {
      if (id) {
        await marcasAguaApi.updateMarcaAguaSeguimiento(id, values);
      } else {
        await marcasAguaApi.createMarcaAguaSeguimiento(values);
      }

      await loadMarcasAgua();
    },
    [loadMarcasAgua],
  );

  const deleteMarcaAgua = useCallback(
    async (id: string) => {
      await marcasAguaApi.deleteMarcaAguaSeguimiento(id);
      await loadMarcasAgua();
    },
    [loadMarcasAgua],
  );

  return {
    marcasAgua,
    isLoading,
    errorMessage,
    reload: loadMarcasAgua,
    saveMarcaAgua,
    deleteMarcaAgua,
  };
}
