import { ColumnDef } from "@tanstack/react-table";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

import { HighlightableCell } from "@/components/shared/table/HighlightableCell";
import { Button } from "@/components/ui";

import { PeriodoColocacion } from "../periodos-colocacion.types";

interface CreatePeriodosColocacionColumnsOptions {
  onEdit: (periodoColocacion: PeriodoColocacion) => void;
  onDelete: (periodoColocacion: PeriodoColocacion) => void;
}

function formatDateOnly(value: string): string {
  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("es-DO", {
    dateStyle: "medium",
  }).format(date);
}

export function createPeriodosColocacionColumns({
  onEdit,
  onDelete,
}: CreatePeriodosColocacionColumnsOptions): ColumnDef<PeriodoColocacion>[] {
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
      id: "fechaInicial",
      accessorKey: "fechaInicial",
      header: "Fecha Inicial",
      label: "Fecha Inicial",
      cell: ({ row }) => (
        <span className="font-medium text-gray-900 dark:text-dark-50">
          {formatDateOnly(row.original.fechaInicial)}
        </span>
      ),
    },
    {
      id: "fechaFinal",
      accessorKey: "fechaFinal",
      header: "Fecha Final",
      label: "Fecha Final",
      cell: ({ row }) => (
        <span className="font-medium text-gray-900 dark:text-dark-50">
          {formatDateOnly(row.original.fechaFinal)}
        </span>
      ),
    },
    {
      id: "generalesSeguimiento",
      accessorKey: "generalesSeguimiento",
      header: "Generales",
      label: "Generales",
      cell: ({ getValue }) => {
        const value = getValue<string | null>() ?? "";

        return value.length === 0 ? (
          <span className="text-sm text-gray-500 dark:text-dark-300">-</span>
        ) : (
          <span className="text-sm text-gray-700 dark:text-dark-200">{value}</span>
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
            title="Editar periodo"
            aria-label="Editar periodo"
          >
            <PencilSquareIcon className="size-4" />
          </Button>

          <Button
            isIcon
            variant="flat"
            className="size-8 rounded-full text-error"
            onClick={() => onDelete(row.original)}
            title="Eliminar periodo"
            aria-label="Eliminar periodo"
          >
            <TrashIcon className="size-4" />
          </Button>
        </div>
      ),
    },
  ];
}
