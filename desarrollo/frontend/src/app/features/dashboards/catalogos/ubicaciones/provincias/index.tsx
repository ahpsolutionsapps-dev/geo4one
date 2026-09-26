import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { ConfirmModal } from "@/components/shared/ConfirmModal";
import {
  EntityListToolbar,
  PaginationSection,
  TableSortIcon,
} from "@/components/shared/table";
import { Page } from "@/components/shared/Page";
import { Card, Table, TBody, Td, Th, THead, Tr } from "@/components/ui";

import { createProvinciasColumns } from "./components/provincias-table.columns";
import { ProvinciasFormModal } from "./components/ProvinciasFormModal";
import { useProvincias } from "./hooks/use-provincias";
import { Provincia, ProvinciaFormValues } from "./provincias.types";

export default function ProvinciasPage() {
  const {
    provincias,
    isLoading,
    errorMessage,
    saveProvincia,
    deleteProvincia,
  } = useProvincias();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProvincia, setSelectedProvincia] = useState<Provincia | null>(null);
  const [provinceToDelete, setProvinceToDelete] = useState<Provincia | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

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
      sorting,
    },
    enableSorting: true,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
  });

  const handleCreate = () => {
    setSelectedProvincia(null);
    setFormOpen(true);
  };

  const handleSaved = useCallback(
    async (values: ProvinciaFormValues) => {
      await saveProvincia(selectedProvincia?.id ?? null, values);
      toast.success(
        selectedProvincia
          ? "Provincia actualizada correctamente"
          : "Provincia creada correctamente",
      );
    },
    [saveProvincia, selectedProvincia],
  );

  const handleDeleteProvince = async () => {
    if (!provinceToDelete) {
      return;
    }

    setConfirmLoading(true);

    try {
      await deleteProvincia(provinceToDelete.id);
      toast.success("Provincia eliminada correctamente");
      setProvinceToDelete(null);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Page title="Provincias">
      <div className="transition-content pt-3 flex h-full min-h-0 w-full flex-col pb-5 supports-[height:1dvh]:min-h-[calc(100dvh-4.5rem)]">
        {errorMessage && (
          <div className="mx-(--margin-x) mb-4 rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
            {errorMessage}
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col">
            <EntityListToolbar
              title="Provincias"
              createLabel="Nueva provincia"
              createTitle="Nueva provincia"
              showSearch={false}
              table={table}
              onCreate={handleCreate}
              actionsPreset="primary"
              showPrint={false}
              showExport={false}
              showShare={false}
              showSaveView={false}
              marginClassName="mx-2 sm:mx-3 md:mx-4"
            />

            <div className="transition-content flex min-h-0 flex-1 flex-col px-2 pt-3 sm:px-3 md:px-4">
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
                                  <TableSortIcon sorted={header.column.getIsSorted()} />
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
                      {isLoading ? (
                        <Tr>
                          <Td
                            colSpan={table.getVisibleLeafColumns().length}
                            className="py-16 text-center"
                          >
                            <div className="flex justify-center">
                              <span className="text-sm text-gray-500 dark:text-dark-300">
                                Cargando provincias...
                              </span>
                            </div>
                          </Td>
                        </Tr>
                      ) : table.getRowModel().rows.length === 0 ? (
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

                {!isLoading && table.getCoreRowModel().rows.length > 0 && (
                  <div className="px-4 pb-4 pt-4 sm:px-5">
                    <PaginationSection table={table} />
                  </div>
                )}
              </Card>
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
        confirmLoading={confirmLoading}
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
