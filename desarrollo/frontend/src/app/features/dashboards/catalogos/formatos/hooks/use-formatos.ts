import { useCallback, useEffect, useState } from "react";

import { catalogosElementosApi } from "../../shared/catalogos-elementos.api";
import {
  FormatoCatalogoFormValues,
  FormatoCatalogoItem,
  TipoElementoOption,
} from "../../shared/catalogos-elementos.types";

function sortFormatos(items: FormatoCatalogoItem[]): FormatoCatalogoItem[] {
  return [...items].sort((a, b) => {
    const byTipo = a.tipoElemento.localeCompare(b.tipoElemento, "es", {
      sensitivity: "base",
    });

    if (byTipo !== 0) {
      return byTipo;
    }

    return a.formato.localeCompare(b.formato, "es", { sensitivity: "base" });
  });
}

export function useFormatos() {
  const [formatos, setFormatos] = useState<FormatoCatalogoItem[]>([]);
  const [tiposElementos, setTiposElementos] = useState<TipoElementoOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [formatosData, tiposData] = await Promise.all([
        catalogosElementosApi.getFormatos(),
        catalogosElementosApi.getTiposElementosOptions(),
      ]);

      setFormatos(sortFormatos(formatosData));
      setTiposElementos(tiposData);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los tipos de formatos",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const saveFormato = useCallback(
    async (id: string | null, values: FormatoCatalogoFormValues) => {
      if (id) {
        await catalogosElementosApi.updateFormato(id, values);
      } else {
        await catalogosElementosApi.createFormato(values);
      }

      await loadData();
    },
    [loadData],
  );

  const deleteFormato = useCallback(
    async (id: string) => {
      await catalogosElementosApi.removeFormato(id);
      await loadData();
    },
    [loadData],
  );

  return {
    formatos,
    tiposElementos,
    isLoading,
    errorMessage,
    saveFormato,
    deleteFormato,
  };
}
