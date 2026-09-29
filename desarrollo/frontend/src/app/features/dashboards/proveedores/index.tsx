import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
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
import { ChangeEvent, useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { EntityListToolbar, PaginationSection, TableSortIcon } from "@/components/shared/table";
import { Page } from "@/components/shared/Page";
import { Button, Card, Table, TBody, Td, Th, THead, Tr } from "@/components/ui";
import { fuzzyFilter } from "@/utils/react-table/fuzzyFilter";

import { ProveedoresFormModal } from "./components/ProveedoresFormModal";
import { createProveedoresColumns } from "./components/proveedores-table.columns";
import { useProveedores } from "./hooks/use-proveedores";
import { Proveedor, ProveedorFormValues } from "./proveedores.types";

export default function ProveedoresPage() {
  const {
    proveedores,
    isLoading,
    errorMessage,
    reload,
    saveProveedor,
    deleteProveedor,
    uploadExcel,
  } = useProveedores();

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "proveedor", desc: false }]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
  const [proveedorToDelete, setProveedorToDelete] = useState<Proveedor | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const columns = useMemo(
    () =>
      createProveedoresColumns({
        onEdit: (item) => {
          setSelectedProveedor(item);
          setFormOpen(true);
        },
        onDelete: setProveedorToDelete,
      }),
    [],
  );

  const table = useReactTable({
    data: proveedores,
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

  const handleSaved = useCallback(
    async (values: ProveedorFormValues) => {
      await saveProveedor(selectedProveedor?.id ?? null, values);
      toast.success(
        selectedProveedor
          ? "Suplidor actualizado correctamente"
          : "Suplidor creado correctamente",
      );
    },
    [saveProveedor, selectedProveedor],
  );

  const handleDeleteProveedor = async () => {
    if (!proveedorToDelete) {
      return;
    }

    setConfirmLoading(true);

    try {
      await deleteProveedor(proveedorToDelete.id);
      toast.success("Suplidor eliminado correctamente");
      setProveedorToDelete(null);
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
        `Archivo "${uploadedFile.originalFileName}" importado. ${uploadedFile.importedCount} suplidores nuevos cargados${duplicatedMessage}`,
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
    <Page title="Suplidores">
      <div className="transition-content pt-3 flex h-full min-h-0 w-full flex-col pb-5 supports-[height:1dvh]:min-h-[calc(100dvh-4.5rem)]">
        {errorMessage && (
          <div className="mx-(--margin-x) mb-4 rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
            {errorMessage}
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col">
          <EntityListToolbar
            title="Suplidores"
            createLabel="Nuevo suplidor"
            createTitle="Nuevo suplidor"
            searchPlaceholder="Buscar suplidor..."
            table={table}
            onCreate={() => {
              setSelectedProveedor(null);
              setFormOpen(true);
            }}
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
                  title="Importar suplidores desde archivo Excel"
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
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                      )}
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
                              Cargando suplidores...
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
                          No se encontraron suplidores
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

      <ProveedoresFormModal
        open={formOpen}
        proveedor={selectedProveedor}
        onClose={() => {
          setFormOpen(false);
          setSelectedProveedor(null);
        }}
        onSaved={handleSaved}
      />

      <ConfirmModal
        show={Boolean(proveedorToDelete)}
        onClose={() => setProveedorToDelete(null)}
        onOk={handleDeleteProveedor}
        state="pending"
        confirmLoading={confirmLoading}
        messages={{
          pending: {
            title: "Eliminar suplidor",
            description: proveedorToDelete
              ? `¿Deseas eliminar el suplidor "${proveedorToDelete.proveedor}"?`
              : "",
            actionText: "Eliminar",
          },
          success: {
            title: "Suplidor eliminado",
            description: "El suplidor fue eliminado correctamente.",
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
