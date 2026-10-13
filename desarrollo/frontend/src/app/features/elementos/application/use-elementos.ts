import { useCallback, useEffect, useState } from "react";

import type { Elemento, ElementoFormValues } from "../domain/types";
import {
  createElemento,
  deleteElemento,
  getElementos,
  updateElemento,
  uploadElementosExcel,
  UploadedElementosExcelFile,
} from "../infrastructure/elementos.repository";

export function useElementos() {
  const [items, setItems] = useState<Elemento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getElementos();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los elementos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const saveElemento = useCallback(
    async (id: number | string | null, values: ElementoFormValues): Promise<Elemento> => {
      const saved = id
        ? await updateElemento(id, values)
        : await createElemento(values);

      await reload();
      return saved;
    },
    [reload],
  );

  const removeElemento = useCallback(
    async (id: number | string): Promise<void> => {
      await deleteElemento(id);
      await reload();
    },
    [reload],
  );

  const uploadExcel = useCallback(
    async (file: File): Promise<UploadedElementosExcelFile> => {
      return uploadElementosExcel(file);
    },
    [],
  );

  return { items, loading, error, reload, uploadExcel, saveElemento, removeElemento };
}
