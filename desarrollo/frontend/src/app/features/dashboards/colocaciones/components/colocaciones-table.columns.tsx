import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ColumnDef } from "@tanstack/react-table";

import { HighlightableCell } from "@/components/shared/table/HighlightableCell";
import { Button } from "@/components/ui";

import { Colocacion } from "../colocaciones.types";

interface CreateColocacionesColumnsOptions {
  onEdit: (item: Colocacion) => void;
  onDelete: (item: Colocacion) => void;
}

function ellipsis(value: string | null): string {
  if (!value) {
    return "-";
  }

  return value.length > 80 ? `${value.slice(0, 77)}...` : value;
}

export function createColocacionesColumns({
  onEdit,
  onDelete,
}: CreateColocacionesColumnsOptions): ColumnDef<Colocacion>[] {
  return [
    {
      id: "codigoSeguimiento",
      accessorKey: "codigoSeguimiento",
      header: "Codigo",
      label: "Codigo",
      cell: ({ getValue, table }) => (
        <span className="font-medium text-primary-600 dark:text-primary-400">
          <HighlightableCell getValue={getValue} table={table} />
        </span>
      ),
    },
    {
      id: "elemento",
      accessorKey: "elemento",
      header: "Elemento",
      label: "Elemento",
      cell: ({ getValue, table }) => (
        <span className="text-sm text-gray-700 dark:text-dark-200">
          <HighlightableCell getValue={getValue} table={table} />
        </span>
      ),
    },
    {
      id: "versionCampana",
      accessorKey: "versionCampana",
      header: "Campana",
      label: "Campana",
      cell: ({ row }) => (
        <div className="text-sm">
          <p className="font-medium text-gray-900 dark:text-dark-50">{row.original.versionCampana}</p>
          <p className="text-gray-500 dark:text-dark-300">{row.original.anunciante}</p>
        </div>
      ),
    },
    {
      id: "periodo",
      accessorKey: "periodo",
      header: "Periodo",
      label: "Periodo",
      cell: ({ getValue, table }) => (
        <span className="text-sm text-gray-700 dark:text-dark-200">
          <HighlightableCell getValue={getValue} table={table} />
        </span>
      ),
    },
    {
      id: "observaciones",
      accessorKey: "observaciones",
      header: "Observaciones",
      label: "Observaciones",
      cell: ({ row }) => (
        <span className="text-sm text-gray-700 dark:text-dark-200">
          {ellipsis(row.original.observaciones)}
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
          {row.original.activo ? "Activa" : "Inactiva"}
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
            title="Editar"
            aria-label="Editar"
          >
            <PencilSquareIcon className="size-4" />
          </Button>

          <Button
            isIcon
            variant="flat"
            className="size-8 rounded-full text-error"
            onClick={() => onDelete(row.original)}
            title="Eliminar"
            aria-label="Eliminar"
          >
            <TrashIcon className="size-4" />
          </Button>
        </div>
      ),
    },
  ];
}
