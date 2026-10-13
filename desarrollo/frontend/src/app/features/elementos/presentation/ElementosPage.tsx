import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpTrayIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { ChangeEvent, useCallback, useMemo, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";

import { useThemeContext } from "@/app/contexts/theme/context";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { Page } from "@/components/shared/Page";
import {
  EntityListToolbar,
  PaginationSection,
  SelectedRowsActions,
  SelectCell,
  SelectHeader,
  TableSortIcon,
  usePersistedTableState,
} from "@/components/shared/table";
import { Badge, Button, Card, Spinner, Table, TBody, Td, Th, THead, Tr } from "@/components/ui";
import { useDidUpdate, useLockScrollbar } from "@/hooks";
import { getUserAgentBrowser } from "@/utils/dom/getUserAgentBrowser";
import { fuzzyFilter } from "@/utils/react-table/fuzzyFilter";

import { useElementoFormOptions } from "../application/use-elemento-form-options";
import { useElementos } from "../application/use-elementos";
import type { Elemento, ElementoFormValues } from "../domain/types";
import { ElementoFormModal } from "./components/ElementoFormModal";

const isSafari = getUserAgentBrowser() === "Safari";

function resolveName(
  map: Map<string, string>,
  id: number | null | undefined,
): string | null {
  if (id == null) {
    return null;
  }

  return map.get(String(id)) ?? `#${id}`;
}

function formatCosto(value: number | string | null): string {
  if (value == null || value === "") {
    return "—";
  }

  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return "—";
  }

  return `RD$ ${numeric.toLocaleString("es-DO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function buildLookup(items: { label: string; value: string }[]): Map<string, string> {
  const map = new Map<string, string>();
  items.forEach((item) => map.set(item.value, item.label));
  return map;
}

export default function ElementosPage() {
  const { items, loading, error, reload, uploadExcel, saveElemento, removeElemento } =
    useElementos();
  const {
    options,
    loading: optionsLoading,
    error: optionsError,
  } = useElementoFormOptions();
  const { cardSkin } = useThemeContext();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedElemento, setSelectedElemento] = useState<Elemento | null>(null);
  const [elementoToDelete, setElementoToDelete] = useState<Elemento | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [importLoading, setImportLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const viewButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    columnVisibility,
    setColumnVisibility,
    columnPinning,
    setColumnPinning,
    tableSettings,
    setTableSettings,
    pagination,
    onPaginationChange,
  } = usePersistedTableState({
    columnVisibilityKey: "column-visibility-elementos",
    columnPinningKey: "column-pinning-elementos",
    tableSettingsKey: "table-settings-elementos",
    paginationKey: "table-pagination-elementos",
  });

  const proveedorById = useMemo(() => buildLookup(options.proveedores), [options.proveedores]);
  const tipoById = useMemo(() => buildLookup(options.tiposElementos), [options.tiposElementos]);
  const formatoById = useMemo(
    () => buildLookup(options.formatos.map((item) => ({ label: item.label, value: item.value }))),
    [options.formatos],
  );
  const tamanoById = useMemo(() => buildLookup(options.tamanos), [options.tamanos]);
  const provinciaById = useMemo(() => buildLookup(options.provincias), [options.provincias]);
  const municipioById = useMemo(
    () => buildLookup(options.municipios.map((item) => ({ label: item.label, value: item.value }))),
    [options.municipios],
  );

  const openCreateForm = useCallback(() => {
    setSelectedElemento(null);
    setFormOpen(true);
  }, []);

  const openEditForm = useCallback((elemento: Elemento) => {
    setSelectedElemento(elemento);
    setFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setFormOpen(false);
    setSelectedElemento(null);
  }, []);

  useHotkeys(
    "mod+n",
    (event) => {
      event.preventDefault();
      if (formOpen) {
        return;
      }
      openCreateForm();
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    },
    [formOpen, openCreateForm],
  );

  useHotkeys(
    "mod+b",
    (event) => {
      event.preventDefault();
      if (formOpen) {
        return;
      }

      const input = searchInputRef.current;
      if (!input) {
        return;
      }

      input.focus();
      input.select();
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    },
    [formOpen],
  );

  useHotkeys(
    "mod+v",
    (event) => {
      if (formOpen) {
        return;
      }

      event.preventDefault();
      viewButtonRef.current?.click();
    },
    {
      enableOnFormTags: false,
      preventDefault: true,
    },
    [formOpen],
  );

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: SelectHeader,
        cell: SelectCell,
      },
      {
        accessorFn: (row: Elemento) => row.idElemento,
        id: "idElemento",
        header: "ID",
        cell: ({ row }: { row: { original: Elemento } }) => row.original.idElemento,
      },
      {
        accessorFn: (row: Elemento) => resolveName(proveedorById, row.idProveedor) ?? "",
        id: "proveedor",
        header: "Proveedor",
        cell: ({ row }: { row: { original: Elemento } }) => (
          <span className="font-medium text-gray-800 dark:text-dark-100">
            {resolveName(proveedorById, row.original.idProveedor) ?? "—"}
          </span>
        ),
      },
      {
        accessorFn: (row: Elemento) => resolveName(tipoById, row.idTipoElemento) ?? "",
        id: "tipoElemento",
        header: "Tipo",
        cell: ({ row }: { row: { original: Elemento } }) =>
          resolveName(tipoById, row.original.idTipoElemento) ?? "—",
      },
      {
        accessorFn: (row: Elemento) => resolveName(formatoById, row.idFormato) ?? "",
        id: "formato",
        header: "Formato",
        cell: ({ row }: { row: { original: Elemento } }) =>
          resolveName(formatoById, row.original.idFormato) ?? "—",
      },
      {
        accessorFn: (row: Elemento) => resolveName(tamanoById, row.idTamano) ?? "",
        id: "tamano",
        header: "Tamaño",
        cell: ({ row }: { row: { original: Elemento } }) =>
          resolveName(tamanoById, row.original.idTamano) ?? "—",
      },
      {
        accessorFn: (row: Elemento) =>
          [resolveName(provinciaById, row.idProvincia), resolveName(municipioById, row.idMunicipio)]
            .filter(Boolean)
            .join(" / "),
        id: "ubicacion",
        header: "Ubicación",
        cell: ({ row }: { row: { original: Elemento } }) => {
          const provincia = resolveName(provinciaById, row.original.idProvincia);
          const municipio = resolveName(municipioById, row.original.idMunicipio);
          const value = [provincia, municipio].filter(Boolean).join(" / ");
          return value || "—";
        },
      },
      {
        accessorKey: "licencia",
        header: "Licencia",
        cell: ({ row }: { row: { original: Elemento } }) => row.original.licencia ?? "—",
      },
      {
        accessorFn: (row: Elemento) => Number(row.costoAlquiler ?? 0),
        id: "costoAlquiler",
        header: "Costo",
        cell: ({ row }: { row: { original: Elemento } }) => formatCosto(row.original.costoAlquiler),
      },
      {
        accessorKey: "activo",
        header: "Estatus",
        cell: ({ row }: { row: { original: Elemento } }) => (
          <Badge variant="soft" color={row.original.activo ? "success" : "error"}>
            {row.original.activo ? "Activo" : "Inactivo"}
          </Badge>
        ),
      },
      {
        id: "acciones",
        header: "Acciones",
        cell: ({ row }: { row: { original: Elemento } }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="flat"
              isIcon
              className="size-7 rounded-full"
              aria-label="Editar elemento"
              title="Editar elemento"
              onClick={() => openEditForm(row.original)}
            >
              <PencilIcon className="size-4.5" />
            </Button>
            <Button
              variant="flat"
              isIcon
              className="size-7 rounded-full"
              aria-label="Eliminar elemento"
              title="Eliminar elemento"
              onClick={() => setElementoToDelete(row.original)}
            >
              <TrashIcon className="size-4.5" />
            </Button>
          </div>
        ),
      },
    ],
    [proveedorById, tipoById, formatoById, tamanoById, provinciaById, municipioById, openEditForm],
  );

  const table = useReactTable({
    data: items,
    columns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      columnPinning,
      rowSelection,
      tableSettings,
      pagination,
    },
    meta: {
      setTableSettings,
      deleteRows: (rows) => {
        const selectedRows = rows.map((row) => row.original);

        if (!selectedRows.length) {
          return;
        }

        void (async () => {
          for (const row of selectedRows) {
            await removeElemento(row.idElemento);
          }

          toast.success(`${selectedRows.length} elemento(s) eliminados`);
        })();
      },
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    enableSorting: tableSettings.enableSorting,
    enableColumnFilters: tableSettings.enableColumnFilters,
    enableRowSelection: () => true,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    getRowId: (row) => String(row.idElemento),
  });

  useDidUpdate(() => table.resetRowSelection(), [items]);
  useLockScrollbar(tableSettings.enableFullScreen);

  const handleSaved = useCallback(
    async (values: ElementoFormValues) => {
      await saveElemento(selectedElemento?.idElemento ?? null, values);
      toast.success(
        selectedElemento ? "Elemento actualizado correctamente" : "Elemento creado correctamente",
      );
    },
    [saveElemento, selectedElemento],
  );

  const handleDeleteElemento = async () => {
    if (!elementoToDelete) {
      return;
    }

    setConfirmLoading(true);

    try {
      await removeElemento(elementoToDelete.idElemento);
      toast.success("Elemento eliminado correctamente");
      setElementoToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo eliminar el elemento");
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
        `Archivo "${uploadedFile.originalFileName}" importado. ${uploadedFile.importedCount} elementos nuevos cargados${duplicatedMessage}`,
      );

      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo importar el archivo");
    } finally {
      setImportLoading(false);
    }
  };

  const loadError = error ?? optionsError;

  return (
    <Page title="Elementos">
      <div className="transition-content pt-3 flex h-full min-h-0 w-full flex-col pb-5 supports-[height:1dvh]:min-h-[80%]">
        {loadError ? (
          <div className="mx-(--margin-x) mb-4 rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
            {loadError}
          </div>
        ) : null}

        <div
          className={clsx(
            "flex min-h-0 flex-1 flex-col",
            tableSettings.enableFullScreen &&
              "dark:bg-dark-900 fixed inset-0 z-61 h-full bg-white pt-3",
          )}
        >
          <EntityListToolbar
            title="Elementos"
            createLabel="Nuevo elemento"
            createTitle="Nuevo elemento (Ctrl+N)"
            searchPlaceholder="Buscar ID, proveedor, licencia, ubicación..."
            searchInputRef={searchInputRef}
            table={table}
            onCreate={openCreateForm}
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
                  title="Importar elementos desde archivo Excel"
                >
                  <ArrowUpTrayIcon className="size-4" />
                  <span>{importLoading ? "Importando..." : "Importar Excel"}</span>
                </Button>
              </>
            }
            actionsPreset="primary"
            marginClassName="mx-2 sm:mx-3 md:mx-4"
            showPrint={false}
            showExport={false}
            showShare={false}
            showSaveView={false}
          />

          <div
            className={clsx(
              "transition-content flex min-h-0 flex-1 flex-col pt-3",
              tableSettings.enableFullScreen ? "overflow-hidden" : "px-2 sm:px-3 md:px-4",
            )}
          >
            <Card
              className={clsx(
                "relative flex min-h-0 flex-1 flex-col",
                tableSettings.enableFullScreen && "overflow-hidden",
              )}
            >
              <div className="table-wrapper min-h-0 min-w-full flex-1 overflow-x-auto">
                <Table
                  hoverable
                  zebra
                  dense={tableSettings.enableRowDense}
                  sticky={tableSettings.enableFullScreen}
                  className="w-full text-left rtl:text-right"
                >
                  <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <Th
                            key={header.id}
                            className={clsx(
                              "dark:bg-dark-800 dark:text-dark-100 bg-gray-200 font-semibold text-gray-800 uppercase first:ltr:rounded-tl-lg last:ltr:rounded-tr-lg first:rtl:rounded-tr-lg last:rtl:rounded-tl-lg",
                              header.column.getCanPin() && [
                                header.column.getIsPinned() === "left" &&
                                  "sticky z-2 ltr:left-0 rtl:right-0",
                                header.column.getIsPinned() === "right" &&
                                  "sticky z-2 ltr:right-0 rtl:left-0",
                              ],
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
                    {loading ? (
                      <Tr>
                        <Td
                          colSpan={table.getVisibleLeafColumns().length}
                          className="py-16 text-center"
                        >
                          <Spinner color="primary" />
                        </Td>
                      </Tr>
                    ) : table.getRowModel().rows.length === 0 ? (
                      <Tr>
                        <Td
                          colSpan={table.getVisibleLeafColumns().length}
                          className="py-16 text-center text-sm text-gray-500 dark:text-dark-300"
                        >
                          No se encontraron elementos
                        </Td>
                      </Tr>
                    ) : (
                      table.getRowModel().rows.map((row) => (
                        <Tr
                          key={row.id}
                          className={clsx(
                            "dark:border-b-dark-500 relative border-y border-transparent border-b-gray-200",
                            row.getIsSelected() &&
                              !isSafari &&
                              "row-selected after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500 after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent",
                          )}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <Td
                              key={cell.id}
                              className={clsx(
                                "relative bg-white",
                                cardSkin === "shadow" ? "dark:bg-dark-700" : "dark:bg-dark-900",
                                cell.column.getCanPin() && [
                                  cell.column.getIsPinned() === "left" &&
                                    "sticky z-2 ltr:left-0 rtl:right-0",
                                  cell.column.getIsPinned() === "right" &&
                                    "sticky z-2 ltr:right-0 rtl:left-0",
                                ],
                              )}
                            >
                              {cell.column.getIsPinned() && (
                                <div
                                  className={clsx(
                                    "dark:border-dark-500 pointer-events-none absolute inset-0 border-gray-200",
                                    cell.column.getIsPinned() === "left"
                                      ? "ltr:border-r rtl:border-l"
                                      : "ltr:border-l rtl:border-r",
                                  )}
                                />
                              )}
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </Td>
                          ))}
                        </Tr>
                      ))
                    )}
                  </TBody>
                </Table>
              </div>

              <SelectedRowsActions table={table} />

              {!loading && table.getCoreRowModel().rows.length > 0 && (
                <div
                  className={clsx(
                    "px-4 pb-4 sm:px-5 sm:pt-4",
                    tableSettings.enableFullScreen && "dark:bg-dark-800 bg-gray-50",
                    !(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && "pt-4",
                  )}
                >
                  <PaginationSection table={table} />
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <ElementoFormModal
        open={formOpen}
        elemento={selectedElemento}
        options={options}
        optionsLoading={optionsLoading}
        onClose={closeForm}
        onSave={handleSaved}
      />

      <ConfirmModal
        show={Boolean(elementoToDelete)}
        onClose={() => setElementoToDelete(null)}
        onOk={handleDeleteElemento}
        state="pending"
        confirmLoading={confirmLoading}
        messages={{
          pending: {
            title: "Eliminar elemento",
            description: elementoToDelete
              ? `¿Deseas eliminar el elemento #${elementoToDelete.idElemento}?`
              : "",
            actionText: "Eliminar",
          },
          success: {
            title: "Elemento eliminado",
            description: "El elemento fue eliminado correctamente.",
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
