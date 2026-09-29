import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ColumnDef } from "@tanstack/react-table";

import { HighlightableCell } from "@/components/shared/table/HighlightableCell";
import { Button } from "@/components/ui";

import { Anunciante } from "../anunciantes.types";

interface CreateAnunciantesColumnsOptions {
  onEdit: (item: Anunciante) => void;
  onDelete: (item: Anunciante) => void;
}

export function createAnunciantesColumns({
  onEdit,
  onDelete,
}: CreateAnunciantesColumnsOptions): ColumnDef<Anunciante>[] {
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
      id: "anunciante",
      accessorKey: "anunciante",
      header: "Anunciante",
      label: "Anunciante",
      cell: ({ getValue, table }) => (
        <span className="font-medium text-gray-900 dark:text-dark-50">
          <HighlightableCell getValue={getValue} table={table} />
        </span>
      ),
    },
    {
      id: "sectorIndustrial",
      accessorKey: "sectorIndustrial",
      header: "Sector",
      label: "Sector",
      cell: ({ getValue, table }) => (
        <span className="text-sm text-gray-700 dark:text-dark-200">
          <HighlightableCell getValue={getValue} table={table} />
        </span>
      ),
    },
    {
      id: "subSectorIndustrial",
      accessorKey: "subSectorIndustrial",
      header: "Sub Sector",
      label: "Sub Sector",
      cell: ({ getValue, table }) => (
        <span className="text-sm text-gray-700 dark:text-dark-200">
          <HighlightableCell getValue={getValue} table={table} />
        </span>
      ),
    },
    {
      id: "categoriaAnunciante",
      accessorKey: "categoriaAnunciante",
      header: "Categoria",
      label: "Categoria",
      cell: ({ getValue, table }) => (
        <span className="text-sm text-gray-700 dark:text-dark-200">
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
