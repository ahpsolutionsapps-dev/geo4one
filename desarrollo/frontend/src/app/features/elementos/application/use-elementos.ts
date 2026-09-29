import { useCallback, useEffect, useState } from "react";

import type { Elemento } from "../domain/types";
import {
  getElementos,
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

  const uploadExcel = useCallback(
    async (file: File): Promise<UploadedElementosExcelFile> => {
      return uploadElementosExcel(file);
    },
    [],
  );

  return { items, loading, error, reload, uploadExcel };
}
