import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";

import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { HighlightableCell } from "@/components/shared/table/HighlightableCell";
import { EntityListToolbar, PaginationSection, TableSortIcon } from "@/components/shared/table";
import { Page } from "@/components/shared/Page";
import { Button, Card, Input, InputErrorMsg, Switch, Table, TBody, Td, Th, THead, Tr } from "@/components/ui";
import { fuzzyFilter } from "@/utils/react-table/fuzzyFilter";
import { typedYupResolver } from "@/utils/typedYupResolver";

import { CatalogoSimpleFormValues, CatalogoSimpleItem } from "./catalogos-elementos.types";
import { useSimpleCatalog } from "./use-simple-catalog";

interface SimpleCatalogApi {
  list: () => Promise<CatalogoSimpleItem[]>;
  create: (values: CatalogoSimpleFormValues) => Promise<CatalogoSimpleItem>;
  update: (id: string, values: CatalogoSimpleFormValues) => Promise<CatalogoSimpleItem>;
  remove: (id: string) => Promise<void>;
}

interface SimpleCatalogModulePageProps {
  title: string;
  singularLabel: string;
  createLabel: string;
  searchPlaceholder: string;
  loadErrorMessage: string;
  api: SimpleCatalogApi;
}

const schema = Yup.object().shape({
  nombre: Yup.string()
    .trim()
    .min(2, "Debe tener al menos 2 caracteres")
    .max(150, "Máximo 150 caracteres")
    .required("El nombre es requerido"),
  activo: Yup.boolean().required(),
});

interface FormModalProps {
  open: boolean;
  singularLabel: string;
  item: CatalogoSimpleItem | null;
  onClose: () => void;
  onSaved: (values: CatalogoSimpleFormValues) => Promise<void>;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-DO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function SimpleCatalogFormModal({
  open,
  singularLabel,
  item,
  onClose,
  onSaved,
}: FormModalProps) {
  const isEditMode = Boolean(item);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CatalogoSimpleFormValues>({
    resolver: typedYupResolver(schema),
    defaultValues: {
      nombre: "",
      activo: true,
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      nombre: item?.nombre ?? "",
      activo: item?.activo ?? true,
    });
  }, [item, open, reset]);

  const submit = handleSubmit(async (values) => {
    await onSaved(values);
    onClose();
  });

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-100" onClose={() => undefined}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm dark:bg-black/40" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl dark:bg-dark-700">
                <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-dark-50">
                  {isEditMode ? `Editar ${singularLabel}` : `Nuevo ${singularLabel}`}
                </Dialog.Title>
                <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">
                  Completa la informacion del catalogo.
                </p>

                <form className="mt-5 space-y-4" onSubmit={submit}>
                  <Input
                    label="Nombre"
                    placeholder="Escribe el nombre"
                    {...register("nombre")}
                    error={errors.nombre?.message}
                  />

                  <div>
                    <Switch label="Activo" {...register("activo")} />
                    <InputErrorMsg when={Boolean(errors.activo?.message)}>
                      {errors.activo?.message}
                    </InputErrorMsg>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outlined" onClick={onClose} disabled={isSubmitting}>
                      Cancelar
                    </Button>
                    <Button type="submit" color="primary" disabled={isSubmitting}>
                      {isSubmitting
                        ? "Guardando..."
                        : isEditMode
                          ? "Guardar cambios"
                          : `Crear ${singularLabel}`}
                    </Button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export function SimpleCatalogModulePage({
  title,
  singularLabel,
  createLabel,
  searchPlaceholder,
  loadErrorMessage,
  api,
}: SimpleCatalogModulePageProps) {
  const { items, isLoading, errorMessage, saveItem, deleteItem } = useSimpleCatalog(
    api,
    loadErrorMessage,
  );

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "nombre", desc: false }]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CatalogoSimpleItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<CatalogoSimpleItem | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const columns = useMemo<ColumnDef<CatalogoSimpleItem>[]>(
    () => [
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
        id: "nombre",
        accessorKey: "nombre",
        header: "Nombre",
        label: "Nombre",
        cell: ({ getValue, table }) => (
          <span className="font-medium text-gray-900 dark:text-dark-50">
            <HighlightableCell getValue={getValue} table={table} />
          </span>
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
          <span className="text-sm text-gray-500 dark:text-dark-300">
            {formatDate(getValue<string>())}
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
              onClick={() => {
                setSelectedItem(row.original);
                setFormOpen(true);
              }}
              title={`Editar ${singularLabel}`}
              aria-label={`Editar ${singularLabel}`}
            >
              <PencilSquareIcon className="size-4" />
            </Button>

            <Button
              isIcon
              variant="flat"
              className="size-8 rounded-full text-error"
              onClick={() => setItemToDelete(row.original)}
              title={`Eliminar ${singularLabel}`}
              aria-label={`Eliminar ${singularLabel}`}
            >
              <TrashIcon className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [singularLabel],
  );

  const table = useReactTable({
    data: items,
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
    async (values: CatalogoSimpleFormValues) => {
      await saveItem(selectedItem?.id ?? null, values);
      toast.success(
        selectedItem
          ? `${singularLabel} actualizado correctamente`
          : `${singularLabel} creado correctamente`,
      );
    },
    [saveItem, selectedItem, singularLabel],
  );

  const handleDeleteItem = async () => {
    if (!itemToDelete) {
      return;
    }

    setConfirmLoading(true);

    try {
      await deleteItem(itemToDelete.id);
      toast.success(`${singularLabel} eliminado correctamente`);
      setItemToDelete(null);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Page title={title}>
      <div className="transition-content pt-3 flex h-full min-h-0 w-full flex-col pb-5 supports-[height:1dvh]:min-h-[calc(100dvh-4.5rem)]">
        {errorMessage && (
          <div className="mx-(--margin-x) mb-4 rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
            {errorMessage}
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col">
          <EntityListToolbar
            title={title}
            createLabel={createLabel}
            createTitle={createLabel}
            searchPlaceholder={searchPlaceholder}
            table={table}
            onCreate={() => {
              setSelectedItem(null);
              setFormOpen(true);
            }}
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
                              Cargando datos...
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
                          No se encontraron registros
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

      <SimpleCatalogFormModal
        open={formOpen}
        singularLabel={singularLabel}
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
        onOk={handleDeleteItem}
        state="pending"
        confirmLoading={confirmLoading}
        messages={{
          pending: {
            title: `Eliminar ${singularLabel}`,
            description: itemToDelete
              ? `¿Deseas eliminar "${itemToDelete.nombre}"?`
              : "",
            actionText: "Eliminar",
          },
          success: {
            title: "Registro eliminado",
            description: "El registro fue eliminado correctamente.",
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
