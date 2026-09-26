import { ColumnDef } from "@tanstack/react-table";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

import { HighlightableCell } from "@/components/shared/table/HighlightableCell";
import { Button } from "@/components/ui";

import { Proveedor } from "../proveedores.types";

interface CreateProveedoresColumnsOptions {
  onEdit: (item: Proveedor) => void;
  onDelete: (item: Proveedor) => void;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-DO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatUbicacion(item: Proveedor): string {
  const values = [item.provinciaNombre, item.municipioNombre, item.sectorBarrioNombre].filter(
    Boolean,
  );

  return values.length ? values.join(" / ") : "—";
}

export function createProveedoresColumns({
  onEdit,
  onDelete,
}: CreateProveedoresColumnsOptions): ColumnDef<Proveedor>[] {
  return [
    {
      id: "id",
      accessorKey: "id",
      header: "ID",
      label: "ID",
      size: 80,
      cell: ({ getValue, table }) => (
        <span className="font-medium text-primary-600 dark:text-primary-400">
          <HighlightableCell getValue={getValue} table={table} />
        </span>
      ),
    },
    {
      id: "proveedor",
      accessorKey: "proveedor",
      header: "Suplidor",
      label: "Suplidor",
      cell: ({ getValue, table }) => (
        <span className="font-medium text-gray-900 dark:text-dark-50">
          <HighlightableCell getValue={getValue} table={table} />
        </span>
      ),
    },
    {
      id: "rnc",
      accessorKey: "rnc",
      header: "RNC",
      label: "RNC",
      cell: ({ getValue }) => (
        <span className="text-gray-600 dark:text-dark-200">{getValue<string | null>() || "—"}</span>
      ),
    },
    {
      id: "personaContacto",
      accessorKey: "personaContacto",
      header: "Contacto",
      label: "Contacto",
      cell: ({ getValue }) => (
        <span className="text-gray-600 dark:text-dark-200">{getValue<string | null>() || "—"}</span>
      ),
    },
    {
      id: "ubicacion",
      accessorFn: (row) => formatUbicacion(row),
      header: "Ubicación",
      label: "Ubicación",
      cell: ({ row }) => (
        <span className="text-gray-600 dark:text-dark-200">{formatUbicacion(row.original)}</span>
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
        <span className="text-sm text-gray-500 dark:text-dark-300">{formatDate(getValue<string>())}</span>
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
            title="Editar suplidor"
            aria-label="Editar suplidor"
          >
            <PencilSquareIcon className="size-4" />
          </Button>

          <Button
            isIcon
            variant="flat"
            className="size-8 rounded-full text-error"
            onClick={() => onDelete(row.original)}
            title="Eliminar suplidor"
            aria-label="Eliminar suplidor"
          >
            <TrashIcon className="size-4" />
          </Button>
        </div>
      ),
    },
  ];
}
