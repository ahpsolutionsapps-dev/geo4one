import { useCallback, useEffect, useState } from "react";

import { marcasProductosApi } from "../data/marcas-productos.api";
import { MarcaProducto, MarcaProductoFormValues } from "../marcas-productos.types";

function sortMarcasProductos(items: MarcaProducto[]): MarcaProducto[] {
  return [...items].sort((a, b) => {
    const byAnunciante = a.anunciante.localeCompare(b.anunciante, "es", {
      sensitivity: "base",
    });

    if (byAnunciante !== 0) {
      return byAnunciante;
    }

    const byCategoria = a.categoriaAnunciante.localeCompare(b.categoriaAnunciante, "es", {
      sensitivity: "base",
    });

    if (byCategoria !== 0) {
      return byCategoria;
    }

    return a.marcaProducto.localeCompare(b.marcaProducto, "es", { sensitivity: "base" });
  });
}

export function useMarcasProductos() {
  const [marcasProductos, setMarcasProductos] = useState<MarcaProducto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadMarcasProductos = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const items = await marcasProductosApi.getMarcasProductos();
      setMarcasProductos(sortMarcasProductos(items));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudieron cargar las marcas");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMarcasProductos();
  }, [loadMarcasProductos]);

  const saveMarcaProducto = useCallback(
    async (id: string | null, values: MarcaProductoFormValues) => {
      if (id) {
        await marcasProductosApi.updateMarcaProducto(id, values);
      } else {
        await marcasProductosApi.createMarcaProducto(values);
      }

      await loadMarcasProductos();
    },
    [loadMarcasProductos],
  );

  const deleteMarcaProducto = useCallback(
    async (id: string) => {
      await marcasProductosApi.deleteMarcaProducto(id);
      await loadMarcasProductos();
    },
    [loadMarcasProductos],
  );

  return {
    marcasProductos,
    isLoading,
    errorMessage,
    reload: loadMarcasProductos,
    saveMarcaProducto,
    deleteMarcaProducto,
  };
}