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
import { useCallback, useMemo, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import { showPrimaryToast } from "@/utils/showPrimaryToast";

import { useThemeContext } from "@/app/contexts/theme/context";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { Page } from "@/components/shared/Page";
import {
  PaginationSection,
  SelectedRowsActions,
  SelectCell,
  SelectHeader,
  TableSortIcon,
  usePersistedTableState,
} from "@/components/shared/table";
import {
  Card,
  Spinner,
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from "@/components/ui";
import { useDidUpdate, useLockScrollbar } from "@/hooks";
import { getUserAgentBrowser } from "@/utils/dom/getUserAgentBrowser";
import { fuzzyFilter } from "@/utils/react-table/fuzzyFilter";
import { Usuario } from "../../domain/entities/usuario.entity";
import { createUsuariosColumns } from "../components/usuarios-table.columns";
import { UsuarioFormModal } from "../components/UsuarioFormModal";
import { UsuariosAtajosModal } from "../components/UsuariosAtajosModal";
import {
  filterUsuariosByRol,
  USUARIOS_ROL_FILTER_ALL,
  UsuariosRolFilterBar,
} from "../components/UsuariosRolFilterBar";
import { UsuariosToolbar } from "../components/UsuariosToolbar";
import { useRoles } from "../hooks/use-roles";
import { useUsuarios } from "../hooks/use-usuarios";

const isSafari = getUserAgentBrowser() === "Safari";

export default function UsuariosPage() {
  const { cardSkin } = useThemeContext();
  const { usuarios, isLoading, errorMessage, reload, anularUsuario } =
    useUsuarios();
  const { roles } = useRoles();

  const [formOpen, setFormOpen] = useState(false);
  const [atajosOpen, setAtajosOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [usuarioToAnular, setUsuarioToAnular] = useState<Usuario | null>(null);
  const [confirmState, setConfirmState] = useState<
    "pending" | "success" | "error"
  >("pending");
  const [confirmLoading, setConfirmLoading] = useState(false);
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
    columnVisibilityKey: "column-visibility-usuarios",
    columnPinningKey: "column-pinning-usuarios",
    tableSettingsKey: "table-settings-usuarios",
    paginationKey: "table-pagination-usuarios",
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedRolFilter, setSelectedRolFilter] = useState(
    USUARIOS_ROL_FILTER_ALL,
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const usuariosFiltrados = useMemo(
    () => filterUsuariosByRol(usuarios, selectedRolFilter),
    [usuarios, selectedRolFilter],
  );

  const openCreateForm = () => {
    setSelectedUsuario(null);
    setFormOpen(true);
  };

  useHotkeys(
    "mod+n",
    (event) => {
      event.preventDefault();
      if (formOpen || usuarioToAnular || atajosOpen) {
        return;
      }
      openCreateForm();
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    },
    [formOpen, usuarioToAnular, atajosOpen],
  );

  useHotkeys(
    "mod+b",
    (event) => {
      event.preventDefault();
      if (formOpen || usuarioToAnular || atajosOpen) {
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
    [formOpen, usuarioToAnular, atajosOpen],
  );

  useHotkeys(
    "mod+v",
    (event) => {
      if (formOpen || usuarioToAnular || atajosOpen) {
        return;
      }

      event.preventDefault();
      viewButtonRef.current?.click();
    },
    {
      enableOnFormTags: false,
      preventDefault: true,
    },
    [formOpen, usuarioToAnular, atajosOpen],
  );

  useHotkeys(
    "shift+/,?",
    (event) => {
      event.preventDefault();
      setAtajosOpen((current) => !current);
    },
    {
      enableOnFormTags: false,
      preventDefault: true,
    },
    [],
  );

  const columns = useMemo(
    () => [
      {
        id: "select",
        label: "Seleccion",
        header: SelectHeader,
        cell: SelectCell,
      },
      ...createUsuariosColumns({
        onEdit: (usuario) => {
          setSelectedUsuario(usuario);
          setFormOpen(true);
        },
        onAnular: setUsuarioToAnular,
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: usuariosFiltrados,
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
      deleteRows: async (rows) => {
        const deletableRows = rows.filter((row) => row.original.id !== "1");

        for (const row of deletableRows) {
          await anularUsuario(row.original.id);
        }

        await reload();
        toast.success("Usuarios anulados correctamente");
      },
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    enableSorting: tableSettings.enableSorting,
    enableColumnFilters: tableSettings.enableColumnFilters,
    enableRowSelection: (row) => row.original.id !== "1",
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
    getRowId: (row) => row.id,
  });

  useDidUpdate(() => table.resetRowSelection(), [usuariosFiltrados]);

  useLockScrollbar(tableSettings.enableFullScreen);

  const closeForm = () => {
    setFormOpen(false);
    setSelectedUsuario(null);
  };

  const handleSaved = useCallback(async () => {
    await reload();
    showPrimaryToast(
      selectedUsuario
        ? "Usuario actualizado correctamente"
        : "Usuario creado correctamente",
    );
  }, [reload, selectedUsuario]);

  const handleConfirmAnular = async () => {
    if (!usuarioToAnular) {
      return;
    }

    setConfirmLoading(true);

    try {
      await anularUsuario(usuarioToAnular.id);
      setConfirmState("success");
      toast.success("Usuario anulado correctamente");
    } catch (error) {
      setConfirmState("error");
      toast.error(
        error instanceof Error
          ? error.message
          : "No fue posible anular el usuario",
      );
    } finally {
      setConfirmLoading(false);
    }
  };

  const closeConfirm = () => {
    setUsuarioToAnular(null);
    setConfirmState("pending");
    setConfirmLoading(false);
  };

  return (
    <Page title="Usuarios">
      <div className="transition-content pt-3 flex h-full min-h-0 w-full flex-col pb-5 supports-[height:1dvh]:min-h-[calc(100dvh-4.5rem)]">
        {errorMessage && (
          <div className="mx-(--margin-x) mb-4 rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
            {errorMessage}
          </div>
        )}

        <div
          className={clsx(
            "flex min-h-0 flex-1 flex-col",
            tableSettings.enableFullScreen &&
              "dark:bg-dark-900 fixed inset-0 z-61 h-full bg-white pt-3",
          )}
        >
          <UsuariosToolbar
            table={table}
            onCreate={openCreateForm}
            onShowShortcuts={() => setAtajosOpen(true)}
            searchInputRef={searchInputRef}
            viewButtonRef={viewButtonRef}
          />

          <UsuariosRolFilterBar
            roles={roles}
            selectedFilter={selectedRolFilter}
            onFilterSelected={setSelectedRolFilter}
          />

          <div
            className={clsx(
              "transition-content flex min-h-0 flex-1 flex-col pt-3",
              tableSettings.enableFullScreen
                ? "overflow-hidden"
                : "px-2 sm:px-3 md:px-4",
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
                    {isLoading ? (
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
                          No se encontraron usuarios
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

              <SelectedRowsActions table={table} />

              {!isLoading && table.getCoreRowModel().rows.length > 0 && (
                <div
                  className={clsx(
                    "px-4 pb-4 sm:px-5 sm:pt-4",
                    tableSettings.enableFullScreen &&
                      "dark:bg-dark-800 bg-gray-50",
                    !(
                      table.getIsSomeRowsSelected() ||
                      table.getIsAllRowsSelected()
                    ) && "pt-4",
                  )}
                >
                  <PaginationSection table={table} />
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <UsuarioFormModal
        key={selectedUsuario?.id ?? "new"}
        open={formOpen}
        usuario={selectedUsuario}
        roles={roles}
        onClose={closeForm}
        onSaved={handleSaved}
        onOpenShortcuts={() => setAtajosOpen(true)}
      />

      <UsuariosAtajosModal
        open={atajosOpen}
        onClose={() => setAtajosOpen(false)}
        initialTab={formOpen ? 1 : 0}
      />

      <ConfirmModal
        show={Boolean(usuarioToAnular)}
        onClose={closeConfirm}
        onOk={handleConfirmAnular}
        state={confirmState}
        confirmLoading={confirmLoading}
        messages={{
          pending: {
            title: "Anular usuario",
            description: usuarioToAnular
              ? `Deseas anular el usuario "${usuarioToAnular.username}"?`
              : "",
            actionText: "Anular",
          },
          success: {
            title: "Usuario anulado",
            description: "El usuario fue anulado correctamente.",
            actionText: "Cerrar",
          },
          error: {
            title: "No se pudo anular",
            description: "Intenta nuevamente o verifica tu conexion.",
            actionText: "Reintentar",
          },
        }}
      />
    </Page>
  );
}
