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
import { showPrimaryToast } from "@/utils/showPrimaryToast";

import { useThemeContext } from "@/app/contexts/theme/context";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { Page } from "@/components/shared/Page";
import {
  PaginationSection,
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
import { useLockScrollbar } from "@/hooks";
import { fuzzyFilter } from "@/utils/react-table/fuzzyFilter";

import { Rol, isSuperAdminRol } from "../../domain/entities/rol.entity";
import { createRolesColumns } from "../components/roles-table.columns";
import { RolFormModal } from "../components/RolFormModal";
import { RolesToolbar } from "../components/RolesToolbar";
import { useRoles } from "../hooks/use-roles";

export default function RolesPage() {
  const { cardSkin } = useThemeContext();
  const { roles, isLoading, errorMessage, reload, anularRol } = useRoles();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);
  const [rolToAnular, setRolToAnular] = useState<Rol | null>(null);
  const [confirmState, setConfirmState] = useState<
    "pending" | "success" | "error"
  >("pending");
  const [confirmLoading, setConfirmLoading] = useState(false);

  const {
    columnVisibility,
    setColumnVisibility,
    columnPinning,
    setColumnPinning,
    pagination,
    onPaginationChange,
    tableSettings,
    setTableSettings,
  } = usePersistedTableState({
    columnVisibilityKey: "column-visibility-roles",
    columnPinningKey: "column-pinning-roles",
    tableSettingsKey: "table-settings-roles",
    paginationKey: "table-pagination-roles",
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () =>
      createRolesColumns({
        onEdit: (rol) => {
          setSelectedRol(rol);
          setFormOpen(true);
        },
        onAnular: setRolToAnular,
      }),
    [],
  );

  const table = useReactTable({
    data: roles,
    columns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      columnPinning,
      pagination,
      tableSettings,
    },
    meta: {
      setTableSettings,
    },
    filterFns: { fuzzy: fuzzyFilter },
    enableSorting: tableSettings.enableSorting,
    enableColumnFilters: tableSettings.enableColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onPaginationChange,
    getRowId: (row) => row.id,
  });

  useLockScrollbar(tableSettings.enableFullScreen);

  const closeForm = () => {
    setFormOpen(false);
    setSelectedRol(null);
  };

  const handleSaved = async () => {
    await reload();
    showPrimaryToast(
      selectedRol ? "Rol actualizado correctamente" : "Rol creado correctamente",
    );
  };

  const handleConfirmAnular = async () => {
    if (!rolToAnular || isSuperAdminRol(rolToAnular)) {
      return;
    }

    setConfirmLoading(true);
    try {
      await anularRol(rolToAnular.id);
      setConfirmState("success");
      toast.success("Rol anulado correctamente");
    } catch (error) {
      setConfirmState("error");
      toast.error(
        error instanceof Error
          ? error.message
          : "No fue posible anular el rol",
      );
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Page title="Roles">
      <div className="transition-content flex h-full min-h-0 w-full flex-col pb-5 supports-[height:1dvh]:min-h-[calc(100dvh-4.5rem)]">
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
          <RolesToolbar
            table={table}
            onCreate={() => {
              setSelectedRol(null);
              setFormOpen(true);
            }}
          />

          <div
            className={clsx(
              "transition-content flex min-h-0 flex-1 flex-col pt-3",
              tableSettings.enableFullScreen
                ? "overflow-hidden"
                : "px-(--margin-x)",
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
                  className="w-full text-left"
                >
                  <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <Th
                            key={header.id}
                            className="dark:bg-dark-800 dark:text-dark-100 bg-gray-200 font-semibold text-gray-800 uppercase first:ltr:rounded-tl-lg last:ltr:rounded-tr-lg"
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
                          No se encontraron roles
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
                              className={clsx(
                                "relative bg-white",
                                cardSkin === "shadow"
                                  ? "dark:bg-dark-700"
                                  : "dark:bg-dark-900",
                              )}
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
                <div
                  className={clsx(
                    "px-4 pb-4 pt-4 sm:px-5",
                    tableSettings.enableFullScreen &&
                      "dark:bg-dark-800 bg-gray-50",
                  )}
                >
                  <PaginationSection table={table} />
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <RolFormModal
        open={formOpen}
        rol={selectedRol}
        onClose={closeForm}
        onSaved={handleSaved}
      />

      <ConfirmModal
        show={Boolean(rolToAnular)}
        onClose={() => {
          setRolToAnular(null);
          setConfirmState("pending");
          setConfirmLoading(false);
        }}
        onOk={handleConfirmAnular}
        state={confirmState}
        confirmLoading={confirmLoading}
        messages={{
          pending: {
            title: "Anular rol",
            description: rolToAnular
              ? `¿Deseas anular el rol "${rolToAnular.rol}"?`
              : "",
            actionText: "Anular",
          },
          success: {
            title: "Rol anulado",
            description: "El rol fue anulado correctamente.",
            actionText: "Cerrar",
          },
          error: {
            title: "No se pudo anular",
            description: "Intenta nuevamente o verifica tu conexión.",
            actionText: "Reintentar",
          },
        }}
      />
    </Page>
  );
}
