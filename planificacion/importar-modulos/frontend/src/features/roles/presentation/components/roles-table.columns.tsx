import { ColumnDef } from "@tanstack/react-table";
import {
  Cog6ToothIcon,
  EllipsisHorizontalIcon,
  NoSymbolIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import clsx from "clsx";

import { HighlightableCell } from "@/components/shared/table/HighlightableCell";
import { Button } from "@/components/ui";

import { Rol, isSuperAdminRol } from "../../domain/entities/rol.entity";

interface CreateRolesColumnsOptions {
  onEdit: (rol: Rol) => void;
  onAnular: (rol: Rol) => void;
}

export function createRolesColumns({
  onEdit,
  onAnular,
}: CreateRolesColumnsOptions): ColumnDef<Rol>[] {
  return [
    {
      id: "id",
      accessorKey: "id",
      header: "ID",
      label: "ID",
      size: 80,
      cell: ({ getValue, table }) => (
        <span className="font-medium text-primary-600 dark:text-primary-400">
          <HighlightableCell getValue={getValue} table={table} />
        </span>
      ),
    },
    {
      id: "rol",
      accessorKey: "rol",
      header: "Rol",
      label: "Rol",
      cell: ({ row, getValue, table }) => (
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-600/10">
            <ShieldCheckIcon className="size-5 text-primary-600" />
          </div>
          <div className="min-w-0">
            <span className="block font-medium text-gray-900 dark:text-dark-50">
              <HighlightableCell getValue={getValue} table={table} />
            </span>
            <span className="block truncate text-xs text-gray-500 dark:text-dark-300">
              {row.original.descripcion}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "modulosCount",
      accessorKey: "modulosCount",
      header: "Módulos",
      label: "Módulos",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-700 dark:text-dark-100">
          {String(getValue() ?? 0)}
        </span>
      ),
    },
    {
      id: "estado",
      accessorKey: "anulado",
      header: "Estado",
      label: "Estado",
      cell: ({ row }) => (
        <span
          className={clsx(
            "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
            row.original.anulado
              ? "bg-error/10 text-error"
              : "bg-success/10 text-success",
          )}
        >
          {row.original.anulado ? "Anulado" : "Activo"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      label: "Acciones",
      size: 60,
      enableSorting: false,
      cell: ({ row }) => {
        const isSuperAdmin = isSuperAdminRol(row.original);

        return (
          <div className="flex justify-end">
            <Menu as="div" className="relative inline-block text-left">
              <MenuButton
                as={Button}
                isIcon
                variant="flat"
                className="size-8 rounded-full"
              >
                <EllipsisHorizontalIcon className="size-5" />
              </MenuButton>
              <Transition
                enter="transition ease-out"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-2"
              >
                <MenuItems className="dark:border-dark-500 dark:bg-dark-700 absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-soft outline-hidden focus-visible:outline-hidden ltr:right-0 rtl:left-0 dark:shadow-none">
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        type="button"
                        onClick={() => onEdit(row.original)}
                        className={clsx(
                          "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors",
                          focus &&
                            "dark:bg-dark-600 dark:text-dark-100 bg-gray-100 text-gray-800",
                        )}
                      >
                        <Cog6ToothIcon className="size-4.5" />
                        <span>Configurar</span>
                      </button>
                    )}
                  </MenuItem>
                  {!isSuperAdmin && !row.original.anulado && (
                    <MenuItem>
                      {({ focus }) => (
                        <button
                          type="button"
                          onClick={() => onAnular(row.original)}
                          className={clsx(
                            "flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-error outline-hidden transition-colors",
                            focus && "bg-error/10",
                          )}
                        >
                          <NoSymbolIcon className="size-4.5" />
                          <span>Anular</span>
                        </button>
                      )}
                    </MenuItem>
                  )}
                </MenuItems>
              </Transition>
            </Menu>
          </div>
        );
      },
    },
  ];
}
