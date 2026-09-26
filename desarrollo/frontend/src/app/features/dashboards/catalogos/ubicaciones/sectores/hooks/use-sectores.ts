import { useCallback, useEffect, useState } from "react";

import { sectoresApi } from "../data/sectores.api";
import { Sector, SectorFormValues } from "../sectores.types";

function sortSectores(items: Sector[]): Sector[] {
  return [...items].sort((a, b) => {
    const byProvince = a.provinciaNombre.localeCompare(b.provinciaNombre, "es", {
      sensitivity: "base",
    });

    if (byProvince !== 0) {
      return byProvince;
    }

    const byMunicipio = a.municipioNombre.localeCompare(b.municipioNombre, "es", {
      sensitivity: "base",
    });

    if (byMunicipio !== 0) {
      return byMunicipio;
    }

    return a.sectorBarrio.localeCompare(b.sectorBarrio, "es", {
      sensitivity: "base",
    });
  });
}

export function useSectores() {
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadSectores = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const items = await sectoresApi.getSectores();
      setSectores(sortSectores(items));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "No se pudieron cargar los sectores",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSectores();
  }, [loadSectores]);

  const saveSector = useCallback(
    async (id: string | null, values: SectorFormValues) => {
      if (id) {
        await sectoresApi.updateSector(id, values);
      } else {
        await sectoresApi.createSector(values);
      }

      await loadSectores();
    },
    [loadSectores],
  );

  const deleteSector = useCallback(
    async (id: string) => {
      await sectoresApi.deleteSector(id);
      await loadSectores();
    },
    [loadSectores],
  );

  return {
    sectores,
    isLoading,
    errorMessage,
    reload: loadSectores,
    saveSector,
    deleteSector,
  };
}
