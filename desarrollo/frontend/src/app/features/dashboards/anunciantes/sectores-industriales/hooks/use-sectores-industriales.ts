import { useCallback, useEffect, useState } from "react";

import {
  SectorIndustrial,
  SectorIndustrialFormValues,
} from "../sectores-industriales.types";
import { sectoresIndustrialesApi } from "../data/sectores-industriales.api";

function sortSectoresIndustriales(items: SectorIndustrial[]): SectorIndustrial[] {
  return [...items].sort((a, b) =>
    a.sectorIndustrial.localeCompare(b.sectorIndustrial, "es", { sensitivity: "base" }),
  );
}

export function useSectoresIndustriales() {
  const [sectoresIndustriales, setSectoresIndustriales] = useState<SectorIndustrial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadSectoresIndustriales = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const items = await sectoresIndustrialesApi.getSectoresIndustriales();
      setSectoresIndustriales(sortSectoresIndustriales(items));
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los sectores industriales",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSectoresIndustriales();
  }, [loadSectoresIndustriales]);

  const saveSectorIndustrial = useCallback(
    async (id: string | null, values: SectorIndustrialFormValues) => {
      if (id) {
        await sectoresIndustrialesApi.updateSectorIndustrial(id, values);
      } else {
        await sectoresIndustrialesApi.createSectorIndustrial(values);
      }

      await loadSectoresIndustriales();
    },
    [loadSectoresIndustriales],
  );

  const deleteSectorIndustrial = useCallback(
    async (id: string) => {
      await sectoresIndustrialesApi.deleteSectorIndustrial(id);
      await loadSectoresIndustriales();
    },
    [loadSectoresIndustriales],
  );

  const uploadExcel = useCallback(async (file: File) => {
    return sectoresIndustrialesApi.uploadExcel(file);
  }, []);

  return {
    sectoresIndustriales,
    isLoading,
    errorMessage,
    reload: loadSectoresIndustriales,
    saveSectorIndustrial,
    deleteSectorIndustrial,
    uploadExcel,
  };
}