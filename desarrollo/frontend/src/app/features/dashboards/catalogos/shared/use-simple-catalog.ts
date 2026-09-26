import { useCallback, useEffect, useState } from "react";

import { CatalogoSimpleFormValues, CatalogoSimpleItem } from "./catalogos-elementos.types";

interface SimpleCatalogApi {
  list: () => Promise<CatalogoSimpleItem[]>;
  create: (values: CatalogoSimpleFormValues) => Promise<CatalogoSimpleItem>;
  update: (id: string, values: CatalogoSimpleFormValues) => Promise<CatalogoSimpleItem>;
  remove: (id: string) => Promise<void>;
}

function sortItems(items: CatalogoSimpleItem[]): CatalogoSimpleItem[] {
  return [...items].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }),
  );
}

export function useSimpleCatalog(api: SimpleCatalogApi, loadErrorMessage: string) {
  const [items, setItems] = useState<CatalogoSimpleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await api.list();
      setItems(sortItems(data));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : loadErrorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [api, loadErrorMessage]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const saveItem = useCallback(
    async (id: string | null, values: CatalogoSimpleFormValues) => {
      if (id) {
        await api.update(id, values);
      } else {
        await api.create(values);
      }

      await loadItems();
    },
    [api, loadItems],
  );

  const deleteItem = useCallback(
    async (id: string) => {
      await api.remove(id);
      await loadItems();
    },
    [api, loadItems],
  );

  return {
    items,
    isLoading,
    errorMessage,
    reload: loadItems,
    saveItem,
    deleteItem,
  };
}
