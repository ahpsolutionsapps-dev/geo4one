import {
  Dialog,
  DialogPanel,
  Tab,
  TabGroup,
  TabList,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  DocumentPlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
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
import clsx from "clsx";
import { Fragment, useCallback, useMemo, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";

import { useThemeContext } from "@/app/contexts/theme/context";
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
import {
  Badge,
  Button,
  Card,
  Input,
  Radio,
  Select,
  Spinner,
  Table,
  TBody,
  Td,
  Textarea,
  Th,
  THead,
  Tr,
} from "@/components/ui";
import { useDidUpdate, useLockScrollbar } from "@/hooks";
import { getUserAgentBrowser } from "@/utils/dom/getUserAgentBrowser";
import { fuzzyFilter } from "@/utils/react-table/fuzzyFilter";

import { useElementos } from "../application/use-elementos";
import type { Elemento } from "../domain/types";

const fallbackRows: Elemento[] = [
  {
    id: "ELM-0001",
    elemento: "Valla Winston Churchill",
    tipo: "Estático",
    formato: "Valla",
    tamaño: "14 x 48",
    proveedor: "Valla Estilo",
    ubicacion: "Santo Domingo",
    licencia: "LIC-2025-001",
    costo: "15,000.00",
    status: "Activo",
    imagen:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ELM-0002",
    elemento: "Pantalla Ágora Mall",
    tipo: "Digital",
    formato: "Pantalla",
    tamaño: "8 x 14",
    proveedor: "Pantalla LED",
    ubicacion: "Santo Domingo",
    licencia: "LIC-2025-002",
    costo: "25,000.00",
    status: "Activo",
    imagen:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ELM-0003",
    elemento: "Mupi Blue Mall",
    tipo: "Estático",
    formato: "Mupi",
    tamaño: "4 x 6",
    proveedor: "Mupi",
    ubicacion: "Santo Domingo",
    licencia: "LIC-2025-003",
    costo: "8,500.00",
    status: "Activo",
    imagen:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ELM-0004",
    elemento: "Valla 27 de Febrero",
    tipo: "Estático",
    formato: "Valla",
    tamaño: "12 x 36",
    proveedor: "Valla Estilo",
    ubicacion: "Santo Domingo",
    licencia: "LIC-2024-015",
    costo: "12,000.00",
    status: "Inactivo",
    imagen:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=80",
  },
];

const statusColors = {
  Activo: "success",
  Inactivo: "error",
  Anulado: "neutral",
} as const;

const isSafari = getUserAgentBrowser() === "Safari";

export default function ElementosPage() {
  const { items, loading, error } = useElementos();
  const { cardSkin } = useThemeContext();

  const rows = useMemo(() => (items.length > 0 ? items : fallbackRows), [items]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedElemento, setSelectedElemento] = useState<Elemento | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const viewButtonRef = useRef<HTMLButtonElement>(null);

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

  const openCreateForm = () => {
    setSelectedElemento(null);
    setFormOpen(true);
  };

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
    [formOpen],
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
        accessorKey: "id",
        id: "id",
        header: "ID",
        cell: ({ row }: { row: { original: Elemento } }) => row.original.id ?? "—",
      },
      {
        accessorKey: "elemento",
        header: "Elemento",
        cell: ({ row }: { row: { original: Elemento } }) => (
          <div className="flex items-center gap-3">
            <img
              src={row.original.imagen ?? fallbackRows[0].imagen}
              alt={row.original.elemento ?? "Elemento"}
              className="h-10 w-10 rounded-md object-cover"
            />
            <span className="font-medium text-gray-800 dark:text-dark-100">
              {row.original.elemento ?? "Sin nombre"}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "tipo",
        header: "Tipo",
      },
      {
        accessorKey: "formato",
        header: "Formato",
      },
      {
        accessorKey: "tamaño",
        header: "Tamaño",
      },
      {
        accessorKey: "proveedor",
        header: "Proveedor",
      },
      {
        accessorKey: "ubicacion",
        header: "Ubicación",
      },
      {
        accessorKey: "licencia",
        header: "Licencia",
      },
      {
        accessorKey: "costo",
        header: "Costo",
      },
      {
        accessorKey: "status",
        header: "Estatus",
        cell: ({ row }: { row: { original: Elemento } }) => (
          <Badge
            variant="soft"
            color={
              statusColors[
                (row.original.status as keyof typeof statusColors) ?? "Anulado"
              ] ?? "neutral"
            }
          >
            {row.original.status ?? "Sin estado"}
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
              aria-label="Ver elemento"
              title="Ver elemento"
            >
              <EyeIcon className="size-4.5" />
            </Button>
            <Button
              variant="flat"
              isIcon
              className="size-7 rounded-full"
              aria-label="Editar elemento"
              title="Editar elemento"
              onClick={() => {
                setSelectedElemento(row.original);
                setFormOpen(true);
              }}
            >
              <PencilIcon className="size-4.5" />
            </Button>
            <Button
              variant="flat"
              isIcon
              className="size-7 rounded-full"
              aria-label="Eliminar elemento"
              title="Eliminar elemento"
              onClick={() => {
                toast.success(`Elemento "${row.original.elemento ?? "sin nombre"}" listo para eliminar.`);
              }}
            >
              <TrashIcon className="size-4.5" />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: rows,
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
      deleteRows: async (selectedRows) => {
        const count = selectedRows.length;
        if (!count) {
          return;
        }

        toast.success(`${count} elemento(s) eliminados`);
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
    getRowId: (row) => String(row.id ?? `${row.elemento ?? "row"}-${row.licencia ?? "no-lic"}`),
  });

  useDidUpdate(() => table.resetRowSelection(), [rows]);
  useLockScrollbar(tableSettings.enableFullScreen);

  const closeForm = () => {
    setFormOpen(false);
    setSelectedElemento(null);
  };

  const handleSaved = useCallback(() => {
    setFormOpen(false);
    setSelectedElemento(null);
    toast.success(
      selectedElemento ? "Elemento actualizado correctamente" : "Elemento creado correctamente",
    );
  }, [selectedElemento]);

  return (
    <Page title="Elementos">
      <div className="transition-content pt-3 flex h-full min-h-0 w-full flex-col pb-5 supports-[height:1dvh]:min-h-[calc(100dvh-4.5rem)]">
        {error ? (
          <div className="mx-(--margin-x) mb-4 rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
            {error}
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
            searchPlaceholder="Buscar ID, elemento, licencia, proveedor..."
            searchInputRef={searchInputRef}
            table={table}
            onCreate={openCreateForm}
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
                                cardSkin === "shadow"
                                  ? "dark:bg-dark-700"
                                  : "dark:bg-dark-900",
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
        show={formOpen}
        onClose={closeForm}
        elemento={selectedElemento}
        onSaved={handleSaved}
      />
    </Page>
  );
}

const modalTabs = [
  "Información General",
  "Ubicación",
  "Licencia y Costos",
  "Archivos y Observaciones",
];

function RequiredLabel({ text }: { text: string }) {
  return (
    <>
      {text} <span className="text-error">*</span>
    </>
  );
}

function ElementoFormModal({
  show,
  elemento,
  onClose,
  onSaved,
}: {
  show: boolean;
  elemento?: Elemento | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  return (
    <Transition show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-5"
        onClose={onClose}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-[2px]" />
        </TransitionChild>

        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <DialogPanel className="scrollbar-sm relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-dark-700">
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400">
                  <DocumentPlusIcon className="size-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-dark-100">
                    {elemento ? "Editar elemento" : "Crear nuevo elemento"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">
                    {elemento
                      ? "Actualiza la información del registro seleccionado."
                      : "Complete la información para registrar un nuevo elemento publicitario."}
                  </p>
                </div>
              </div>

              <Button
                variant="flat"
                isIcon
                className="mt-0.5 size-8 rounded-full"
                aria-label="Cerrar modal"
                onClick={onClose}
              >
                <XMarkIcon className="size-5" />
              </Button>
            </div>

            <div className="max-h-[calc(100vh-10rem)] overflow-y-auto px-5 pb-5 sm:px-6 sm:pb-6">
              <TabGroup>
                <TabList className="hide-scrollbar mt-2 flex overflow-x-auto border-b border-gray-200 dark:border-dark-500">
                  {modalTabs.map((tab) => (
                    <Tab
                      key={tab}
                      className="-mb-px shrink-0 border-b-2 border-transparent px-3 py-3 text-sm text-gray-500 outline-hidden transition hover:text-primary-600 data-selected:border-primary-500 data-selected:font-medium data-selected:text-primary-600 dark:text-dark-300 dark:hover:text-primary-400 dark:data-selected:text-primary-400"
                    >
                      {tab}
                    </Tab>
                  ))}
                </TabList>
              </TabGroup>

              <div className="space-y-5 pt-5">
                <section className="space-y-3">
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-dark-100">
                    Proveedor
                  </h4>
                  <div className="grid gap-3 md:grid-cols-12">
                    <Select
                      classNames={{ root: "md:col-span-8" }}
                      label={<RequiredLabel text="Suplidor / Proveedor" />}
                      defaultValue={elemento?.proveedor ?? ""}
                    >
                      <option value="" disabled>
                        Seleccione un suplidor
                      </option>
                      <option value="vallas-estilo">Vallas Estilo</option>
                      <option value="media-group">Media Group SRL</option>
                      <option value="vision-publicidad">Vision Publicidad</option>
                    </Select>

                    <Input
                      classNames={{ root: "md:col-span-4" }}
                      label="ID-Suplidor"
                      value={elemento?.id ?? ""}
                      placeholder="Se generará automáticamente"
                      readOnly
                      disabled
                    />
                  </div>
                </section>

                <section className="space-y-3 border-t border-gray-200 pt-5 dark:border-dark-500">
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-dark-100">
                    Datos del Elemento
                  </h4>
                  <div className="grid gap-3 md:grid-cols-12">
                    <Select
                      classNames={{ root: "md:col-span-4" }}
                      label={<RequiredLabel text="Tipo de Elemento" />}
                      defaultValue={elemento?.tipo ?? ""}
                    >
                      <option value="" disabled>
                        Seleccione un tipo
                      </option>
                      <option value="estatico">Estático</option>
                      <option value="digital">Digital</option>
                      <option value="movil">Móvil</option>
                    </Select>

                    <Select
                      classNames={{ root: "md:col-span-4" }}
                      label={<RequiredLabel text="Formato" />}
                      defaultValue={elemento?.formato ?? ""}
                    >
                      <option value="" disabled>
                        Seleccione un formato
                      </option>
                      <option value="valla">Valla</option>
                      <option value="mupi">Mupi</option>
                      <option value="pantalla">Pantalla</option>
                    </Select>

                    <Select
                      classNames={{ root: "md:col-span-4" }}
                      label={<RequiredLabel text="Tamaño" />}
                      defaultValue={elemento?.tamaño ?? ""}
                    >
                      <option value="" disabled>
                        Seleccione un tamaño
                      </option>
                      <option value="4x6">4 x 6</option>
                      <option value="8x14">8 x 14</option>
                      <option value="12x36">12 x 36</option>
                    </Select>

                    <Select
                      classNames={{ root: "md:col-span-5" }}
                      label="Orientación"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Seleccione una orientación
                      </option>
                      <option value="norte">Norte</option>
                      <option value="sur">Sur</option>
                      <option value="este">Este</option>
                      <option value="oeste">Oeste</option>
                    </Select>

                    <div className="md:col-span-7">
                      <label className="input-label">
                        <span className="input-label">
                          <RequiredLabel text="Estatus" />
                        </span>
                      </label>
                      <div className="mt-3 flex flex-wrap items-center gap-5">
                        <Radio name="status" label="Sí (Activo)" defaultChecked />
                        <Radio name="status" label="No (Inactivo)" />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-3 border-t border-gray-200 pt-5 dark:border-dark-500">
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-dark-100">
                    Información Básica
                  </h4>
                  <div className="grid gap-3 md:grid-cols-12">
                    <Input
                      classNames={{ root: "md:col-span-8" }}
                      label={<RequiredLabel text="Nombre / Referencia del Elemento" />}
                      defaultValue={elemento?.elemento ?? ""}
                      placeholder="Ej. ELM-0011"
                    />

                    <Input
                      classNames={{ root: "md:col-span-4" }}
                      label="ID-Seguimiento"
                      placeholder="Ej. SEG-2025-001"
                    />

                    <Textarea
                      classNames={{ root: "md:col-span-12" }}
                      label={<RequiredLabel text="Dirección" />}
                      defaultValue={elemento?.ubicacion ?? ""}
                      rows={2}
                      placeholder="Ingrese la dirección exacta del elemento"
                    />
                  </div>
                </section>

                <section className="space-y-3 border-t border-gray-200 pt-5 dark:border-dark-500">
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-dark-100">
                    Ubicación
                  </h4>
                  <div className="grid gap-3 md:grid-cols-12">
                    <Select
                      classNames={{ root: "md:col-span-4" }}
                      label={<RequiredLabel text="Provincia" />}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Seleccione una provincia
                      </option>
                      <option value="santo-domingo">Santo Domingo</option>
                      <option value="santiago">Santiago</option>
                    </Select>

                    <Select
                      classNames={{ root: "md:col-span-4" }}
                      label={<RequiredLabel text="Municipio" />}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Seleccione un municipio
                      </option>
                      <option value="distrito-nacional">Distrito Nacional</option>
                      <option value="santo-domingo-este">Santo Domingo Este</option>
                    </Select>

                    <Select
                      classNames={{ root: "md:col-span-4" }}
                      label={<RequiredLabel text="Sector / Barrio" />}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Seleccione un sector
                      </option>
                      <option value="naco">Naco</option>
                      <option value="piantini">Piantini</option>
                    </Select>

                    <Input
                      classNames={{ root: "md:col-span-5" }}
                      label="Circunscripción"
                      placeholder="Ingrese la circunscripción"
                    />

                    <Input
                      classNames={{ root: "md:col-span-3.5" }}
                      label="Latitud"
                      placeholder="Ej. 18.4861"
                    />

                    <Input
                      classNames={{ root: "md:col-span-3.5" }}
                      label="Longitud"
                      placeholder="Ej. -69.9312"
                    />
                  </div>
                </section>
              </div>

              <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-5 dark:border-dark-500">
                <Button variant="outlined" className="min-w-[9rem]" onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  className="min-w-[12rem]"
                  onClick={() => {
                    onSaved();
                  }}
                >
                  {elemento ? "Guardar cambios" : "Guardar elemento"}
                </Button>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}
