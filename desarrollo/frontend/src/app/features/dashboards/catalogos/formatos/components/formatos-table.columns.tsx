import { ColumnDef } from "@tanstack/react-table";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

import { HighlightableCell } from "@/components/shared/table/HighlightableCell";
import { Button } from "@/components/ui";

import { FormatoCatalogoItem } from "../../shared/catalogos-elementos.types";

interface CreateFormatosColumnsOptions {
  onEdit: (item: FormatoCatalogoItem) => void;
  onDelete: (item: FormatoCatalogoItem) => void;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-DO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function createFormatosColumns({
  onEdit,
  onDelete,
}: CreateFormatosColumnsOptions): ColumnDef<FormatoCatalogoItem>[] {
  return [
    {
      id: "id",
      accessorKey: "id",
      header: "ID",
      label: "ID",
      size: 90,
      cell: ({ getValue, table }) => (
        <span className="font-medium text-primary-600 dark:text-primary-400">
          <HighlightableCell getValue={getValue} table={table} />
        </span>
      ),
    },
    {
      id: "tipoElemento",
      accessorKey: "tipoElemento",
      header: "Tipo de elemento",
      label: "Tipo de elemento",
      cell: ({ getValue, table }) => (
        <span className="font-medium text-gray-900 dark:text-dark-50">
          <HighlightableCell getValue={getValue} table={table} />
        </span>
      ),
    },
    {
      id: "formato",
      accessorKey: "formato",
      header: "Formato",
      label: "Formato",
      cell: ({ getValue, table }) => (
        <span className="font-medium text-gray-900 dark:text-dark-50">
          <HighlightableCell getValue={getValue} table={table} />
        </span>
      ),
    },
    {
      id: "activo",
      accessorKey: "activo",
      header: "Estado",
      label: "Estado",
      cell: ({ row }) => (
        <span
          className={
            row.original.activo
              ? "inline-flex rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success"
              : "inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-dark-600 dark:text-dark-200"
          }
        >
          {row.original.activo ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      id: "fechaCreacion",
      accessorKey: "fechaCreacion",
      header: "Creado",
      label: "Creado",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-500 dark:text-dark-300">
          {formatDate(getValue<string>())}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      label: "Acciones",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            isIcon
            variant="flat"
            className="size-8 rounded-full"
            onClick={() => onEdit(row.original)}
            title="Editar tipo de formato"
            aria-label="Editar tipo de formato"
          >
            <PencilSquareIcon className="size-4" />
          </Button>

          <Button
            isIcon
            variant="flat"
            className="size-8 rounded-full text-error"
            onClick={() => onDelete(row.original)}
            title="Eliminar tipo de formato"
            aria-label="Eliminar tipo de formato"
          >
            <TrashIcon className="size-4" />
          </Button>
        </div>
      ),
    },
  ];
}
