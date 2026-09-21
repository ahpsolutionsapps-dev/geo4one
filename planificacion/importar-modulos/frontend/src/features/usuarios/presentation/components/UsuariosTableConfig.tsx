import { ViewColumnsIcon } from "@heroicons/react/24/outline";
import { Table } from "@tanstack/react-table";
import { RefObject } from "react";

import { useBreakpointsContext } from "@/app/contexts/breakpoint/context";
import { ResponsiveFilter } from "@/components/shared/table/ResponsiveFilter";
import { TableSettings } from "@/components/shared/table/TableSettings";
import { Usuario } from "../../domain/entities/usuario.entity";

interface UsuariosTableConfigProps {
  table: Table<Usuario>;
  viewButtonRef?: RefObject<HTMLButtonElement | null>;
}

export function UsuariosTableConfig({
  table,
  viewButtonRef,
}: UsuariosTableConfigProps) {
  const { smAndDown } = useBreakpointsContext();

  return (
    <ResponsiveFilter
      anchor={{ to: "bottom start", gap: 8 }}
      buttonRef={viewButtonRef}
      buttonTitle="Vista (Ctrl+V)"
      buttonContent={
        <>
          <ViewColumnsIcon className="size-4" />
          <span>Vista</span>
        </>
      }
      classNames={{
        button: "border-solid!",
      }}
    >
      {smAndDown ? (
        <div className="dark:border-dark-500 mx-auto flex h-12 w-full shrink-0 items-center justify-between border-b border-gray-200 px-3">
          <p className="dark:text-dark-50 truncate text-start text-base font-medium text-gray-800">
            Vista de tabla
          </p>
        </div>
      ) : (
        <h3 className="text-sm-plus dark:text-dark-100 px-3 pt-2.5 font-medium tracking-wide text-gray-800">
          Vista de tabla
        </h3>
      )}

      <div className="flex flex-col max-sm:overflow-hidden sm:w-64">
        <TableSettings table={table} />
      </div>
    </ResponsiveFilter>
  );
}
