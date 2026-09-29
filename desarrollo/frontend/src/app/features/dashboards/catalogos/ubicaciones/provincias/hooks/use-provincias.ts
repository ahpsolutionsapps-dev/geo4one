import { useCallback, useEffect, useState } from "react";

import { Provincia, ProvinciaFormValues } from "../provincias.types";
import { provinciasApi, UploadedExcelFile } from "../data/provincias.api";

function sortProvincias(items: Provincia[]): Provincia[] {
  return [...items].sort((a, b) =>
    a.provincia.localeCompare(b.provincia, "es", { sensitivity: "base" }),
  );
}

export function useProvincias() {
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadProvincias = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const items = await provinciasApi.getProvincias();
      setProvincias(sortProvincias(items));
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar las provincias",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProvincias();
  }, [loadProvincias]);

  const saveProvincia = useCallback(
    async (id: string | null, values: ProvinciaFormValues) => {
      if (id) {
        await provinciasApi.updateProvincia(id, values);
      } else {
        await provinciasApi.createProvincia(values);
      }

      await loadProvincias();
    },
    [loadProvincias],
  );

  const deleteProvincia = useCallback(
    async (id: string) => {
      await provinciasApi.deleteProvincia(id);
      await loadProvincias();
    },
    [loadProvincias],
  );

  const uploadExcel = useCallback(
    async (file: File): Promise<UploadedExcelFile> => {
      return provinciasApi.uploadExcel(file);
    },
    [],
  );

  return {
    provincias,
    isLoading,
    errorMessage,
    reload: loadProvincias,
    saveProvincia,
    deleteProvincia,
    uploadExcel,
  };
}
