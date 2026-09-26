import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { ConfirmModal } from "@/components/shared/ConfirmModal";
import {
  EntityListToolbar,
  PaginationSection,
  TableSortIcon,
} from "@/components/shared/table";
import { Page } from "@/components/shared/Page";
import { Card, Table, TBody, Td, Th, THead, Tr } from "@/components/ui";
import { fuzzyFilter } from "@/utils/react-table/fuzzyFilter";

import { createProvinciasColumns } from "./components/provincias-table.columns";
import { ProvinciasFormModal } from "./components/ProvinciasFormModal";
import { Provincia, ProvinciaFormValues } from "./provincias.types";

const initialProvincias: Provincia[] = [
  {
    id: "1",
    provincia: "Distrito Nacional",
    latitud: 18.4861,
    longitud: -69.9312,
    activo: true,
    fechaCreacion: "2026-01-10T10:00:00.000Z",
    fechaActualizacion: "2026-01-10T10:00:00.000Z",
  },
  {
    id: "2",
    provincia: "Santo Domingo",
    latitud: 18.4855,
    longitud: -69.9316,
    activo: true,
    fechaCreacion: "2026-01-12T10:00:00.000Z",
    fechaActualizacion: "2026-01-12T10:00:00.000Z",
  },
  {
    id: "3",
    provincia: "Santiago",
    latitud: 19.4517,
    longitud: -70.697,
    activo: true,
    fechaCreacion: "2026-01-14T10:00:00.000Z",
    fechaActualizacion: "2026-01-14T10:00:00.000Z",
  },
  {
    id: "4",
    provincia: "La Vega",
    latitud: 19.2211,
    longitud: -70.529,
    activo: false,
    fechaCreacion: "2026-01-15T10:00:00.000Z",
    fechaActualizacion: "2026-01-15T10:00:00.000Z",
  },
];

function sortProvincias(items: Provincia[]): Provincia[] {
  return [...items].sort((a, b) =>
    a.provincia.localeCompare(b.provincia, "es", { sensitivity: "base" }),
  );
}

function parseCoordinate(value: string): number | null {
  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export default function ProvinciasPage() {
  const [provincias, setProvincias] = useState<Provincia[]>(() =>
    sortProvincias(initialProvincias),
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProvincia, setSelectedProvincia] = useState<Provincia | null>(
    null,
  );
  const [provinceToDelete, setProvinceToDelete] = useState<Provincia | null>(
    null,
  );

  const columns = useMemo(
    () =>
      createProvinciasColumns({
        onEdit: (provincia) => {
          setSelectedProvincia(provincia);
          setFormOpen(true);
        },
        onDelete: setProvinceToDelete,
      }),
    [],
  );

  const table = useReactTable({
    data: provincias,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    enableSorting: true,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
  });

  const handleCreate = () => {
    setSelectedProvincia(null);
    setFormOpen(true);
  };

  const handleSaved = async (values: ProvinciaFormValues) => {
    const now = new Date().toISOString();

    setProvincias((current) => {
      if (selectedProvincia) {
        return sortProvincias(
          current.map((item) =>
            item.id === selectedProvincia.id
              ? {
                  ...item,
                  provincia: values.provincia.trim(),
                  latitud: parseCoordinate(values.latitud),
                  longitud: parseCoordinate(values.longitud),
                  activo: values.activo,
                  fechaActualizacion: now,
                }
              : item,
          ),
        );
      }

      const newProvincia: Provincia = {
        id: crypto.randomUUID(),
        provincia: values.provincia.trim(),
        latitud: parseCoordinate(values.latitud),
        longitud: parseCoordinate(values.longitud),
        activo: values.activo,
        fechaCreacion: now,
        fechaActualizacion: now,
      };

      return sortProvincias([...current, newProvincia]);
    });

    toast.success(
      selectedProvincia
        ? "Provincia actualizada correctamente"
        : "Provincia creada correctamente",
    );
  };

  const handleDeleteProvince = () => {
    if (!provinceToDelete) {
      return;
    }

    setProvincias((current) =>
      current.filter((item) => item.id !== provinceToDelete.id),
    );
    setProvinceToDelete(null);
    toast.success("Provincia eliminada correctamente");
  };

  return (
    <Page title="Provincias">
      <div className="transition-content flex h-full min-h-0 w-full flex-col pb-5 supports-[height:1dvh]:min-h-[calc(100dvh-4.5rem)]">
        <div className="transition-content flex min-h-0 flex-1 flex-col pt-3">
          <div className="flex min-h-0 flex-1 flex-col px-(--margin-x)">
            <EntityListToolbar
              title="Provincias"
              createLabel="Nueva provincia"
              createTitle="Nueva provincia"
              searchPlaceholder="Buscar provincia..."
              table={table}
              onCreate={handleCreate}
              actionsPreset="primary"
              showPrint={false}
              showExport={false}
              showShare={false}
              showSaveView={false}
            />

            <div className="mt-3 flex min-h-0 flex-1 flex-col">
              <Card className="relative flex min-h-0 flex-1 flex-col">
                <div className="table-wrapper min-h-0 min-w-full flex-1 overflow-x-auto">
                  <Table className="w-full text-left rtl:text-right">
                    <THead>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <Th
                              key={header.id}
                              className={clsx(
                                "dark:bg-dark-800 dark:text-dark-100 bg-gray-200 font-semibold text-gray-800 uppercase first:ltr:rounded-tl-lg last:ltr:rounded-tr-lg",
                              )}
                            >
                              {header.column.getCanSort() ? (
                                <div
                                  className="flex cursor-pointer items-center space-x-3 select-none"
                                  onClick={header.column.getToggleSortingHandler()}
                                >
                                  <span className="flex-1">
                                    {header.isPlaceholder
                                      ? null
                                      : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext(),
                                        )}
                                  </span>
                                  <TableSortIcon
                                    sorted={header.column.getIsSorted()}
                                  />
                                </div>
                              ) : header.isPlaceholder ? null : (
                                flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )
                              )}
                            </Th>
                          ))}
                        </Tr>
                      ))}
                    </THead>

                    <TBody>
                      {table.getRowModel().rows.length === 0 ? (
                        <Tr>
                          <Td
                            colSpan={table.getVisibleLeafColumns().length}
                            className="py-16 text-center text-sm text-gray-500 dark:text-dark-300"
                          >
                            No se encontraron provincias
                          </Td>
                        </Tr>
                      ) : (
                        table.getRowModel().rows.map((row) => (
                          <Tr
                            key={row.id}
                            className="dark:border-b-dark-500 relative border-y border-transparent border-b-gray-200"
                          >
                            {row.getVisibleCells().map((cell) => (
                              <Td
                                key={cell.id}
                                className="relative bg-white dark:bg-dark-900"
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </Td>
                            ))}
                          </Tr>
                        ))
                      )}
                    </TBody>
                  </Table>
                </div>

                {table.getCoreRowModel().rows.length > 0 && (
                  <div className="px-4 pb-4 pt-4 sm:px-5">
                    <PaginationSection table={table} />
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>

      <ProvinciasFormModal
        open={formOpen}
        provincia={selectedProvincia}
        onClose={() => {
          setFormOpen(false);
          setSelectedProvincia(null);
        }}
        onSaved={handleSaved}
      />

      <ConfirmModal
        show={Boolean(provinceToDelete)}
        onClose={() => setProvinceToDelete(null)}
        onOk={handleDeleteProvince}
        state="pending"
        confirmLoading={false}
        messages={{
          pending: {
            title: "Eliminar provincia",
            description: provinceToDelete
              ? `¿Deseas eliminar la provincia "${provinceToDelete.provincia}"?`
              : "",
            actionText: "Eliminar",
          },
          success: {
            title: "Provincia eliminada",
            description: "La provincia fue eliminada correctamente.",
            actionText: "Cerrar",
          },
          error: {
            title: "No se pudo eliminar",
            description: "Intenta nuevamente.",
            actionText: "Reintentar",
          },
        }}
      />
    </Page>
  );
}
