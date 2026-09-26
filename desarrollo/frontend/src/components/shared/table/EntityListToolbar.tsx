import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Table } from "@tanstack/react-table";
import clsx from "clsx";
import { ReactNode, RefObject } from "react";

import { Button, Input } from "@/components/ui";

interface EntityListToolbarProps<TData> {
  title: string;
  createLabel: string;
  createTitle?: string;
  searchPlaceholder?: string;
  searchInputRef?: RefObject<HTMLInputElement | null>;
  table: Table<TData>;
  tableConfig?: ReactNode;
  extraActions?: ReactNode;
  onCreate: () => void;
  actionsPreset?: "primary" | "neutral";
  showPrint?: boolean;
  showExport?: boolean;
  showShare?: boolean;
  showSaveView?: boolean;
  showExportPdfInMoreMenu?: boolean;
  marginClassName?: string;
}

export function EntityListToolbar<TData>({
  title,
  createLabel,
  createTitle,
  searchPlaceholder,
  searchInputRef,
  table,
  tableConfig,
  extraActions,
  onCreate,
  marginClassName = "mx-(--margin-x)",
}: EntityListToolbarProps<TData>) {
  const globalFilter = (table.getState().globalFilter as string) ?? "";

  return (
    <div className={clsx(marginClassName, "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between")}>
      <div className="min-w-0">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-dark-50">
          {title}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <Input
          ref={searchInputRef}
          value={globalFilter}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          placeholder={searchPlaceholder || "Buscar..."}
          prefix={<MagnifyingGlassIcon className="size-4" />}
          classNames={{
            root: "min-w-[220px]",
            input: "h-9",
          }}
        />

        {tableConfig ? <div className="shrink-0">{tableConfig}</div> : null}

        {extraActions ? (
          <div className={clsx("flex items-center gap-2")}>{extraActions}</div>
        ) : null}

        <Button
          type="button"
          color="primary"
          className="h-9 gap-1.5"
          title={createTitle}
          onClick={onCreate}
        >
          <PlusIcon className="size-4" />
          <span>{createLabel}</span>
        </Button>
      </div>
    </div>
  );
}
