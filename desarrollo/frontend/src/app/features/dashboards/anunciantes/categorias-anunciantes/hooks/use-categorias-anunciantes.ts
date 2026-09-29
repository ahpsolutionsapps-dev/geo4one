import { useCallback, useEffect, useState } from "react";

import { categoriasAnunciantesApi } from "../data/categorias-anunciantes.api";
import {
  CategoriaAnunciante,
  CategoriaAnuncianteFormValues,
} from "../categorias-anunciantes.types";

function sortCategoriasAnunciantes(items: CategoriaAnunciante[]): CategoriaAnunciante[] {
  return [...items].sort((a, b) => {
    const bySector = a.sectorIndustrial.localeCompare(b.sectorIndustrial, "es", {
      sensitivity: "base",
    });

    if (bySector !== 0) {
      return bySector;
    }

    const bySubSector = a.subSectorIndustrial.localeCompare(b.subSectorIndustrial, "es", {
      sensitivity: "base",
    });

    if (bySubSector !== 0) {
      return bySubSector;
    }

    return a.categoriaAnunciante.localeCompare(b.categoriaAnunciante, "es", {
      sensitivity: "base",
    });
  });
}

export function useCategoriasAnunciantes() {
  const [categoriasAnunciantes, setCategoriasAnunciantes] = useState<CategoriaAnunciante[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadCategoriasAnunciantes = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const items = await categoriasAnunciantesApi.getCategoriasAnunciantes();
      setCategoriasAnunciantes(sortCategoriasAnunciantes(items));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "No se pudieron cargar las categorías",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategoriasAnunciantes();
  }, [loadCategoriasAnunciantes]);

  const saveCategoriaAnunciante = useCallback(
    async (id: string | null, values: CategoriaAnuncianteFormValues) => {
      if (id) {
        await categoriasAnunciantesApi.updateCategoriaAnunciante(id, values);
      } else {
        await categoriasAnunciantesApi.createCategoriaAnunciante(values);
      }

      await loadCategoriasAnunciantes();
    },
    [loadCategoriasAnunciantes],
  );

  const deleteCategoriaAnunciante = useCallback(
    async (id: string) => {
      await categoriasAnunciantesApi.deleteCategoriaAnunciante(id);
      await loadCategoriasAnunciantes();
    },
    [loadCategoriasAnunciantes],
  );

  return {
    categoriasAnunciantes,
    isLoading,
    errorMessage,
    reload: loadCategoriasAnunciantes,
    saveCategoriaAnunciante,
    deleteCategoriaAnunciante,
  };
}