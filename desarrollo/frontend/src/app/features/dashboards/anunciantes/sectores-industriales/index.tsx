import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { ChangeEvent, useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { ConfirmModal } from "@/components/shared/ConfirmModal";
import {
  EntityListToolbar,
  PaginationSection,
  TableSortIcon,
} from "@/components/shared/table";
import { Page } from "@/components/shared/Page";
import { Button, Card, Table, TBody, Td, Th, THead, Tr } from "@/components/ui";

import { createSectoresIndustrialesColumns } from "./components/sectores-industriales-table.columns";
import { SectoresIndustrialesFormModal } from "./components/SectoresIndustrialesFormModal";
import { useSectoresIndustriales } from "./hooks/use-sectores-industriales";
import {
  SectorIndustrial,
  SectorIndustrialFormValues,
} from "./sectores-industriales.types";

export default function SectoresIndustrialesPage() {
  const {
    sectoresIndustriales,
    isLoading,
    errorMessage,
    reload,
    saveSectorIndustrial,
    deleteSectorIndustrial,
    uploadExcel,
  } = useSectoresIndustriales();

  const [sorting, setSorting] = useState<SortingState>([{ id: "sectorIndustrial", desc: false }]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedSectorIndustrial, setSelectedSectorIndustrial] = useState<SectorIndustrial | null>(null);
  const [sectorIndustrialToDelete, setSectorIndustrialToDelete] = useState<SectorIndustrial | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const columns = useMemo(
    () =>
      createSectoresIndustrialesColumns({
        onEdit: (item) => {
          setSelectedSectorIndustrial(item);
          setFormOpen(true);
        },
        onDelete: setSectorIndustrialToDelete,
      }),
    [],
  );

  const table = useReactTable({
    data: sectoresIndustriales,
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
    setSelectedSectorIndustrial(null);
    setFormOpen(true);
  };

  const handleSaved = useCallback(
    async (values: SectorIndustrialFormValues) => {
      await saveSectorIndustrial(selectedSectorIndustrial?.id ?? null, values);
      toast.success(
        selectedSectorIndustrial
          ? "Sector industrial actualizado correctamente"
          : "Sector industrial creado correctamente",
      );
    },
    [saveSectorIndustrial, selectedSectorIndustrial],
  );

  const handleDeleteSectorIndustrial = async () => {
    if (!sectorIndustrialToDelete) {
      return;
    }

    setConfirmLoading(true);

    try {
      await deleteSectorIndustrial(sectorIndustrialToDelete.id);
      toast.success("Sector industrial eliminado correctamente");
      setSectorIndustrialToDelete(null);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportExcel = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";

    if (!file) {
      return;
    }

    const validFileExtension = /\.(xlsx|xls)$/i.test(file.name);

    if (!validFileExtension) {
      toast.error("Selecciona un archivo Excel (.xlsx o .xls)");
      return;
    }

    setImportLoading(true);

    try {
      const uploadedFile = await uploadExcel(file);
      const duplicatedMessage =
        uploadedFile.skippedCount > 0
          ? `; ${uploadedFile.skippedCount} filas se omitieron`
          : "";

      toast.success(
        `Archivo "${uploadedFile.originalFileName}" importado. ${uploadedFile.importedCount} sectores nuevos cargados${duplicatedMessage}`,
      );
      await reload();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo importar el archivo",
      );
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <Page title="Sectores Industriales">
      <div className="transition-content pt-3 flex h-full min-h-0 w-full flex-col pb-5 supports-[height:1dvh]:min-h-[calc(100dvh-4.5rem)]">
        {errorMessage && (
          <div className="mx-(--margin-x) mb-4 rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
            {errorMessage}
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col">
          <EntityListToolbar
            title="Sectores Industriales"
            createLabel="Nuevo sector industrial"
            createTitle="Nuevo sector industrial"
            showSearch={false}
            table={table}
            onCreate={handleCreate}
            extraActions={
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  className="hidden"
                  onChange={handleImportExcel}
                />

                <Button
                  type="button"
                  variant="outlined"
                  className="h-9 gap-1.5"
                  onClick={handleImportClick}
                  disabled={importLoading}
                  title="Importar sectores industriales desde archivo Excel"
                >
                  <ArrowUpTrayIcon className="size-4" />
                  <span>{importLoading ? "Importando..." : "Importar Excel"}</span>
                </Button>
              </>
            }
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
                        <Td
                          colSpan={table.getVisibleLeafColumns().length}
                          className="py-16 text-center"
                        >
                          <div className="flex justify-center">
                            <span className="text-sm text-gray-500 dark:text-dark-300">
                              Cargando sectores industriales...
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
                          No se encontraron sectores industriales
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

      <SectoresIndustrialesFormModal
        open={formOpen}
        sectorIndustrial={selectedSectorIndustrial}
        onClose={() => {
          setFormOpen(false);
          setSelectedSectorIndustrial(null);
        }}
        onSaved={handleSaved}
      />

      <ConfirmModal
        show={Boolean(sectorIndustrialToDelete)}
        onClose={() => setSectorIndustrialToDelete(null)}
        onOk={handleDeleteSectorIndustrial}
        state="pending"
        confirmLoading={confirmLoading}
        messages={{
          pending: {
            title: "Eliminar sector industrial",
            description: sectorIndustrialToDelete
              ? `¿Deseas eliminar el sector industrial \"${sectorIndustrialToDelete.sectorIndustrial}\"?`
              : "",
            actionText: "Eliminar",
          },
          success: {
            title: "Sector industrial eliminado",
            description: "El sector industrial fue eliminado correctamente.",
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