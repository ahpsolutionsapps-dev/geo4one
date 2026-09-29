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

import { createMarcasAguaColumns } from "./components/marcas-agua-table.columns";
import { MarcasAguaFormModal } from "./components/MarcasAguaFormModal";
import { useMarcasAguaSeguimiento } from "./hooks/use-marcas-agua";
import {
  MarcaAguaSeguimiento,
  MarcaAguaSeguimientoFormValues,
} from "./marcas-agua.types";

export default function MarcasAguaPage() {
  const { marcasAgua, isLoading, errorMessage, saveMarcaAgua, deleteMarcaAgua } =
    useMarcasAguaSeguimiento();

  const [sorting, setSorting] = useState<SortingState>([{ id: "versionCampana", desc: false }]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MarcaAguaSeguimiento | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MarcaAguaSeguimiento | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const columns = useMemo(
    () =>
      createMarcasAguaColumns({
        onEdit: (item) => {
          setSelectedItem(item);
          setFormOpen(true);
        },
        onDelete: setItemToDelete,
      }),
    [],
  );

  const table = useReactTable({
    data: marcasAgua,
    columns,
    state: { sorting },
    enableSorting: true,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
  });

  const handleCreate = () => {
    setSelectedItem(null);
    setFormOpen(true);
  };

  const handleSaved = useCallback(
    async (values: MarcaAguaSeguimientoFormValues) => {
      await saveMarcaAgua(selectedItem?.id ?? null, values);
      toast.success(
        selectedItem
          ? "Marca de agua actualizada correctamente"
          : "Marca de agua creada correctamente",
      );
    },
    [saveMarcaAgua, selectedItem],
  );

  const handleDelete = async () => {
    if (!itemToDelete) {
      return;
    }

    setConfirmLoading(true);

    try {
      await deleteMarcaAgua(itemToDelete.id);
      toast.success("Marca de agua eliminada correctamente");
      setItemToDelete(null);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Page title="Marcas de Agua">
      <div className="transition-content pt-3 flex h-full min-h-0 w-full flex-col pb-5 supports-[height:1dvh]:min-h-[calc(100dvh-4.5rem)]">
        {errorMessage && (
          <div className="mx-(--margin-x) mb-4 rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
            {errorMessage}
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col">
          <EntityListToolbar
            title="Marcas de Agua"
            createLabel="Nueva marca de agua"
            createTitle="Nueva marca de agua"
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
                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                </span>
                                <TableSortIcon sorted={header.column.getIsSorted()} />
                              </div>
                            ) : header.isPlaceholder ? null : (
                              flexRender(header.column.columnDef.header, header.getContext())
                            )}
                          </Th>
                        ))}
                      </Tr>
                    ))}
                  </THead>

                  <TBody>
                    {isLoading ? (
                      <Tr>
                        <Td colSpan={table.getVisibleLeafColumns().length} className="py-16 text-center">
                          <div className="flex justify-center">
                            <span className="text-sm text-gray-500 dark:text-dark-300">
                              Cargando marcas de agua...
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
                          No se encontraron marcas de agua
                        </Td>
                      </Tr>
                    ) : (
                      table.getRowModel().rows.map((row) => (
                        <Tr
                          key={row.id}
                          className="dark:border-b-dark-500 relative border-y border-transparent border-b-gray-200"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <Td key={cell.id} className="relative bg-white dark:bg-dark-900">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
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

      <MarcasAguaFormModal
        open={formOpen}
        item={selectedItem}
        onClose={() => {
          setFormOpen(false);
          setSelectedItem(null);
        }}
        onSaved={handleSaved}
      />

      <ConfirmModal
        show={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onOk={handleDelete}
        state="pending"
        confirmLoading={confirmLoading}
        messages={{
          pending: {
            title: "Eliminar marca de agua",
            description: itemToDelete
              ? `¿Deseas eliminar la marca de agua de \"${itemToDelete.versionCampana}\"?`
              : "",
            actionText: "Eliminar",
          },
          success: {
            title: "Marca de agua eliminada",
            description: "La marca de agua fue eliminada correctamente.",
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
