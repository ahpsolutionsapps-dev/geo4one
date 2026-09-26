import {
  ColumnPinningState,
  OnChangeFn,
  PaginationState,
  VisibilityState,
} from "@tanstack/react-table";

import { useLocalStorage } from "@/hooks";
import { TableSettings } from "./TableSettings";

interface UsePersistedTableStateOptions {
  columnVisibilityKey: string;
  columnPinningKey: string;
  tableSettingsKey: string;
  paginationKey: string;
}

const defaultPagination: PaginationState = {
  pageIndex: 0,
  pageSize: 10,
};

const defaultTableSettings: TableSettings = {
  enableFullScreen: false,
  enableRowDense: false,
  enableColumnFilters: false,
  enableSorting: true,
};

export function usePersistedTableState({
  columnVisibilityKey,
  columnPinningKey,
  tableSettingsKey,
  paginationKey,
}: UsePersistedTableStateOptions) {
  const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>(
    columnVisibilityKey,
    {},
  );
  const [columnPinning, setColumnPinning] = useLocalStorage<ColumnPinningState>(
    columnPinningKey,
    {},
  );
  const [tableSettings, setTableSettings] = useLocalStorage<TableSettings>(
    tableSettingsKey,
    defaultTableSettings,
  );
  const [pagination, setPagination] = useLocalStorage<PaginationState>(
    paginationKey,
    defaultPagination,
  );

  const onPaginationChange: OnChangeFn<PaginationState> = (updaterOrValue) => {
    setPagination((prev) =>
      typeof updaterOrValue === "function"
        ? updaterOrValue(prev)
        : updaterOrValue,
    );
  };

  return {
    columnVisibility,
    setColumnVisibility,
    columnPinning,
    setColumnPinning,
    tableSettings,
    setTableSettings,
    pagination,
    onPaginationChange,
  };
}
