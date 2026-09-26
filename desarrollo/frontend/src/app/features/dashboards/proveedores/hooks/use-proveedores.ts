import { useCallback, useEffect, useState } from "react";

import { Proveedor, ProveedorFormValues } from "../proveedores.types";
import { proveedoresApi } from "../data/proveedores.api";

function sortProveedores(items: Proveedor[]): Proveedor[] {
  return [...items].sort((a, b) =>
    a.proveedor.localeCompare(b.proveedor, "es", { sensitivity: "base" }),
  );
}

export function useProveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadProveedores = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const items = await proveedoresApi.getProveedores();
      setProveedores(sortProveedores(items));
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los suplidores",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProveedores();
  }, [loadProveedores]);

  const saveProveedor = useCallback(
    async (id: string | null, values: ProveedorFormValues) => {
      if (id) {
        await proveedoresApi.updateProveedor(id, values);
      } else {
        await proveedoresApi.createProveedor(values);
      }

      await loadProveedores();
    },
    [loadProveedores],
  );

  const deleteProveedor = useCallback(
    async (id: string) => {
      await proveedoresApi.deleteProveedor(id);
      await loadProveedores();
    },
    [loadProveedores],
  );

  return {
    proveedores,
    isLoading,
    errorMessage,
    reload: loadProveedores,
    saveProveedor,
    deleteProveedor,
  };
}
