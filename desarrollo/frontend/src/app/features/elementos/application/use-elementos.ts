import { useEffect, useState } from "react";

import type { Elemento } from "../domain/types";
import { getElementos } from "../infrastructure/elementos.repository";

export function useElementos() {
  const [items, setItems] = useState<Elemento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
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
    };

    void load();
  }, []);

  return { items, loading, error };
}
