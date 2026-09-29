import { useCallback, useEffect, useState } from "react";

import {
  municipiosApi,
  UploadedMunicipiosExcelFile,
} from "../data/municipios.api";
import { Municipio, MunicipioFormValues } from "../municipios.types";

function sortMunicipios(items: Municipio[]): Municipio[] {
  return [...items].sort((a, b) => {
    const byProvince = a.provinciaNombre.localeCompare(b.provinciaNombre, "es", {
      sensitivity: "base",
    });

    if (byProvince !== 0) {
      return byProvince;
    }

    return a.municipio.localeCompare(b.municipio, "es", { sensitivity: "base" });
  });
}

export function useMunicipios() {
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadMunicipios = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const items = await municipiosApi.getMunicipios();
      setMunicipios(sortMunicipios(items));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "No se pudieron cargar los municipios",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMunicipios();
  }, [loadMunicipios]);

  const saveMunicipio = useCallback(
    async (id: string | null, values: MunicipioFormValues) => {
      if (id) {
        await municipiosApi.updateMunicipio(id, values);
      } else {
        await municipiosApi.createMunicipio(values);
      }

      await loadMunicipios();
    },
    [loadMunicipios],
  );

  const deleteMunicipio = useCallback(
    async (id: string) => {
      await municipiosApi.deleteMunicipio(id);
      await loadMunicipios();
    },
    [loadMunicipios],
  );

  const uploadExcel = useCallback(
    async (file: File): Promise<UploadedMunicipiosExcelFile> => {
      return municipiosApi.uploadExcel(file);
    },
    [],
  );

  return {
    municipios,
    isLoading,
    errorMessage,
    reload: loadMunicipios,
    saveMunicipio,
    deleteMunicipio,
    uploadExcel,
  };
}
