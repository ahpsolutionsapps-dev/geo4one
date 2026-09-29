import { ColumnDef } from "@tanstack/react-table";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

import { HighlightableCell } from "@/components/shared/table/HighlightableCell";
import { Button } from "@/components/ui";

import { ComboAnunciante } from "../combos-anunciantes.types";

interface CreateCombosAnunciantesColumnsOptions {
  onEdit: (comboAnunciante: ComboAnunciante) => void;
  onDelete: (comboAnunciante: ComboAnunciante) => void;
}

export function createCombosAnunciantesColumns({
  onEdit,
  onDelete,
}: CreateCombosAnunciantesColumnsOptions): ColumnDef<ComboAnunciante>[] {
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
      id: "comboAnunciante",
      accessorKey: "comboAnunciante",
      header: "Combo",
      label: "Combo",
      cell: ({ getValue, table }) => (
        <span className="font-medium text-gray-900 dark:text-dark-50">
          <HighlightableCell getValue={getValue} table={table} />
        </span>
      ),
    },
    {
      id: "marcas",
      accessorKey: "marcas",
      header: "Marcas",
      label: "Marcas",
      enableSorting: false,
      cell: ({ row }) => {
        const resumen = row.original.marcas
          .slice()
          .sort((a, b) => a.orden - b.orden)
          .map((item) => `${item.orden}. ${item.marcaProducto}`)
          .join(" / ");

        return (
          <span className="text-sm text-gray-700 dark:text-dark-200">
            {resumen.length > 0 ? resumen : "-"}
          </span>
        );
      },
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
            title="Editar combo"
            aria-label="Editar combo"
          >
            <PencilSquareIcon className="size-4" />
          </Button>

          <Button
            isIcon
            variant="flat"
            className="size-8 rounded-full text-error"
            onClick={() => onDelete(row.original)}
            title="Eliminar combo"
            aria-label="Eliminar combo"
          >
            <TrashIcon className="size-4" />
          </Button>
        </div>
      ),
    },
  ];
}
