import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowTopRightOnSquareIcon,
  EllipsisHorizontalIcon,
  NoSymbolIcon,
  PencilSquareIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";

import { HighlightableCell } from "@/components/shared/table/HighlightableCell";
import { SecureImage } from "@/components/shared/SecureImage";
import { Button } from "@/components/ui";
import {
  getUsuarioEstadoLabel,
  Usuario,
} from "../../domain/entities/usuario.entity";

interface CreateUsuariosColumnsOptions {
  onEdit: (usuario: Usuario) => void;
  onAnular: (usuario: Usuario) => void;
}

function getEstadoClassName(usuario: Usuario): string {
  if (!usuario.habilitado) {
    return "bg-gray-100 text-gray-600 dark:bg-dark-600 dark:text-dark-200";
  }

  if (!usuario.verificado) {
    return "bg-warning/10 text-warning dark:bg-warning/15";
  }

  if (usuario.estatus === 1) {
    return "bg-success/10 text-success dark:bg-success/15";
  }

  return "bg-error/10 text-error dark:bg-error/15";
}

export function createUsuariosColumns({
  onEdit,
  onAnular,
}: CreateUsuariosColumnsOptions): ColumnDef<Usuario>[] {
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
      id: "usuario",
      accessorKey: "username",
      header: "Usuario",
      label: "Usuario",
      cell: ({ row, getValue, table }) => (
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-600/10">
            {row.original.imagen?.trim() ? (
              <SecureImage
                src={row.original.imagen}
                alt={row.original.username}
                className="size-full object-cover"
              />
            ) : (
              <UserIcon className="size-5 text-primary-600" />
            )}
          </div>
          <div className="min-w-0">
            <span className="block font-medium text-gray-900 dark:text-dark-50">
              <HighlightableCell getValue={getValue} table={table} />
            </span>
            <span className="block truncate text-xs text-gray-500 dark:text-dark-300">
              {row.original.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "rolNombre",
      accessorKey: "rolNombre",
      header: "Rol",
      label: "Rol",
      cell: ({ row, table }) => {
        const value = row.original.rolNombre?.trim() || "Sin rol";

        return (
          <span className="text-gray-500 dark:text-dark-300">
            <HighlightableCell getValue={() => value as never} table={table} />
          </span>
        );
      },
    },
    {
      id: "estado",
      header: "Estado",
      label: "Estado",
      enableSorting: false,
      cell: ({ row }) => {
        const label = getUsuarioEstadoLabel(row.original);

        return (
          <span
            className={clsx(
              "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
              getEstadoClassName(row.original),
            )}
          >
            {label}
          </span>
        );
      },
    },
    {
      id: "comentario",
      accessorKey: "comentario",
      header: "Comentario",
      label: "Comentario",
      cell: ({ row, table }) => {
        const value = row.original.comentario?.trim() || "—";

        return (
          <span className="text-gray-500 dark:text-dark-300">
            <HighlightableCell getValue={() => value as never} table={table} />
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Acciones",
      label: "Acciones",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => {
        const usuario = row.original;
        const hasBlockedActions = usuario.id === "1";

        return (
          <div className="flex justify-center space-x-1.5">
            <Button
              isIcon
              disabled={hasBlockedActions}
              className="size-8 rounded-full"
              onClick={() => !hasBlockedActions && onEdit(usuario)}
            >
              <ArrowTopRightOnSquareIcon className="size-4" />
            </Button>

            <Menu as="div" className="relative inline-block text-left">
              <MenuButton
                as={Button}
                isIcon
                disabled={hasBlockedActions}
                className="size-8 rounded-full"
              >
                <EllipsisHorizontalIcon className="size-4.5" />
              </MenuButton>

              {!hasBlockedActions && (
                <Transition
                  as={MenuItems}
                  enter="transition ease-out"
                  enterFrom="opacity-0 translate-y-2"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-2"
                  className="dark:border-dark-500 dark:bg-dark-750 absolute z-100 mt-1.5 w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden ltr:right-0 rtl:left-0 dark:shadow-none"
                >
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        type="button"
                        className={clsx(
                          "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors",
                          focus &&
                            "dark:bg-dark-600 dark:text-dark-100 bg-gray-100 text-gray-800",
                        )}
                        onClick={() => onEdit(usuario)}
                      >
                        <PencilSquareIcon className="size-4.5 stroke-1" />
                        <span>Editar</span>
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        type="button"
                        className={clsx(
                          "this:error text-this dark:text-this-light flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors",
                          focus && "bg-this/10 dark:bg-this-light/10",
                        )}
                        onClick={() => onAnular(usuario)}
                      >
                        <NoSymbolIcon className="size-4.5 stroke-1" />
                        <span>Anular</span>
                      </button>
                    )}
                  </MenuItem>
                </Transition>
              )}
            </Menu>
          </div>
        );
      },
    },
  ];
}
