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

import { createCampanasColumns } from "./components/campanas-table.columns";
import { CampanasFormModal } from "./components/CampanasFormModal";
import { useCampanas } from "./hooks/use-campanas";
import { Campana, CampanaFormValues } from "./campanas.types";

export default function CampanasPage() {
  const { campanas, isLoading, errorMessage, saveCampana, deleteCampana } = useCampanas();

  const [sorting, setSorting] = useState<SortingState>([{ id: "versionCampana", desc: false }]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCampana, setSelectedCampana] = useState<Campana | null>(null);
  const [campanaToDelete, setCampanaToDelete] = useState<Campana | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const columns = useMemo(
    () =>
      createCampanasColumns({
        onEdit: (item) => {
          setSelectedCampana(item);
          setFormOpen(true);
        },
        onDelete: setCampanaToDelete,
      }),
    [],
  );

  const table = useReactTable({
    data: campanas,
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
    setSelectedCampana(null);
    setFormOpen(true);
  };

  const handleSaved = useCallback(
    async (values: CampanaFormValues) => {
      await saveCampana(selectedCampana?.id ?? null, values);
      toast.success(
        selectedCampana ? "Campana actualizada correctamente" : "Campana creada correctamente",
      );
    },
    [saveCampana, selectedCampana],
  );

  const handleDelete = async () => {
    if (!campanaToDelete) {
      return;
    }

    setConfirmLoading(true);

    try {
      await deleteCampana(campanaToDelete.id);
      toast.success("Campana eliminada correctamente");
      setCampanaToDelete(null);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Page title="Campanas">
      <div className="transition-content pt-3 flex h-full min-h-0 w-full flex-col pb-5 supports-[height:1dvh]:min-h-[calc(100dvh-4.5rem)]">
        {errorMessage && (
          <div className="mx-(--margin-x) mb-4 rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
            {errorMessage}
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col">
          <EntityListToolbar
            title="Campanas"
            createLabel="Nueva campana"
            createTitle="Nueva campana"
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
                              Cargando campanas...
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
                          No se encontraron campanas
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

      <CampanasFormModal
        open={formOpen}
        campana={selectedCampana}
        onClose={() => {
          setFormOpen(false);
          setSelectedCampana(null);
        }}
        onSaved={handleSaved}
      />

      <ConfirmModal
        show={Boolean(campanaToDelete)}
        onClose={() => setCampanaToDelete(null)}
        onOk={handleDelete}
        state="pending"
        confirmLoading={confirmLoading}
        messages={{
          pending: {
            title: "Eliminar campana",
            description: campanaToDelete
              ? `¿Deseas eliminar la campana \"${campanaToDelete.versionCampana}\"?`
              : "",
            actionText: "Eliminar",
          },
          success: {
            title: "Campana eliminada",
            description: "La campana fue eliminada correctamente.",
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
