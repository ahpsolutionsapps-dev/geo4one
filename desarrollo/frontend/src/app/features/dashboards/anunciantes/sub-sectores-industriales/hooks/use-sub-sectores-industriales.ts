import { useCallback, useEffect, useState } from "react";

import { subSectoresIndustrialesApi } from "../data/sub-sectores-industriales.api";
import {
  SubSectorIndustrial,
  SubSectorIndustrialFormValues,
} from "../sub-sectores-industriales.types";

function sortSubSectoresIndustriales(items: SubSectorIndustrial[]): SubSectorIndustrial[] {
  return [...items].sort((a, b) => {
    const bySector = a.sectorIndustrial.localeCompare(b.sectorIndustrial, "es", {
      sensitivity: "base",
    });

    if (bySector !== 0) {
      return bySector;
    }

    return a.subSectorIndustrial.localeCompare(b.subSectorIndustrial, "es", {
      sensitivity: "base",
    });
  });
}

export function useSubSectoresIndustriales() {
  const [subSectoresIndustriales, setSubSectoresIndustriales] = useState<SubSectorIndustrial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadSubSectoresIndustriales = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const items = await subSectoresIndustrialesApi.getSubSectoresIndustriales();
      setSubSectoresIndustriales(sortSubSectoresIndustriales(items));
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los sub sectores industriales",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSubSectoresIndustriales();
  }, [loadSubSectoresIndustriales]);

  const saveSubSectorIndustrial = useCallback(
    async (id: string | null, values: SubSectorIndustrialFormValues) => {
      if (id) {
        await subSectoresIndustrialesApi.updateSubSectorIndustrial(id, values);
      } else {
        await subSectoresIndustrialesApi.createSubSectorIndustrial(values);
      }

      await loadSubSectoresIndustriales();
    },
    [loadSubSectoresIndustriales],
  );

  const deleteSubSectorIndustrial = useCallback(
    async (id: string) => {
      await subSectoresIndustrialesApi.deleteSubSectorIndustrial(id);
      await loadSubSectoresIndustriales();
    },
    [loadSubSectoresIndustriales],
  );

  const uploadExcel = useCallback(async (file: File) => {
    return subSectoresIndustrialesApi.uploadExcel(file);
  }, []);

  return {
    subSectoresIndustriales,
    isLoading,
    errorMessage,
    reload: loadSubSectoresIndustriales,
    saveSubSectorIndustrial,
    deleteSubSectorIndustrial,
    uploadExcel,
  };
}