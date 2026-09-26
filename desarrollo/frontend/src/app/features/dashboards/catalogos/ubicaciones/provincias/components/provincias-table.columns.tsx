import { ColumnDef } from "@tanstack/react-table";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

import { HighlightableCell } from "@/components/shared/table/HighlightableCell";
import { Button } from "@/components/ui";

import { Provincia } from "../provincias.types";

interface CreateProvinciasColumnsOptions {
  onEdit: (provincia: Provincia) => void;
  onDelete: (provincia: Provincia) => void;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-DO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function createProvinciasColumns({
  onEdit,
  onDelete,
}: CreateProvinciasColumnsOptions): ColumnDef<Provincia>[] {
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
      id: "provincia",
      accessorKey: "provincia",
      header: "Provincia",
      label: "Provincia",
      cell: ({ getValue, table }) => (
        <span className="font-medium text-gray-900 dark:text-dark-50">
          <HighlightableCell getValue={getValue} table={table} />
        </span>
      ),
    },
    {
      id: "latitud",
      accessorKey: "latitud",
      header: "Latitud",
      label: "Latitud",
      cell: ({ getValue }) => (
        <span className="text-gray-600 dark:text-dark-200">
          {getValue<number | null>() ?? "—"}
        </span>
      ),
    },
    {
      id: "longitud",
      accessorKey: "longitud",
      header: "Longitud",
      label: "Longitud",
      cell: ({ getValue }) => (
        <span className="text-gray-600 dark:text-dark-200">
          {getValue<number | null>() ?? "—"}
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
            title="Editar provincia"
            aria-label="Editar provincia"
          >
            <PencilSquareIcon className="size-4" />
          </Button>

          <Button
            isIcon
            variant="flat"
            className="size-8 rounded-full text-error"
            onClick={() => onDelete(row.original)}
            title="Eliminar provincia"
            aria-label="Eliminar provincia"
          >
            <TrashIcon className="size-4" />
          </Button>
        </div>
      ),
    },
  ];
}
