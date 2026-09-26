import {
  ShieldCheckIcon,
  Squares2X2Icon,
  UserMinusIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

import { Rol } from "../../domain/entities/rol.entity";
import { Usuario } from "../../domain/entities/usuario.entity";

export const USUARIOS_ROL_FILTER_ALL = "all";
export const USUARIOS_ROL_FILTER_SIN_ROL = "sin_rol";
const ROL_PREFIX = "rol_";

export function usuariosRolFilterId(rolId: string): string {
  return `${ROL_PREFIX}${rolId}`;
}

export function filterUsuariosByRol(
  usuarios: Usuario[],
  selectedFilter: string,
): Usuario[] {
  if (selectedFilter === USUARIOS_ROL_FILTER_ALL) {
    return usuarios;
  }

  if (selectedFilter === USUARIOS_ROL_FILTER_SIN_ROL) {
    return usuarios.filter((usuario) => !usuario.idRol);
  }

  if (selectedFilter.startsWith(ROL_PREFIX)) {
    const rolId = selectedFilter.slice(ROL_PREFIX.length);
    return usuarios.filter((usuario) => usuario.idRol === rolId);
  }

  return usuarios;
}

interface UsuariosRolFilterBarProps {
  roles: Rol[];
  selectedFilter: string;
  onFilterSelected: (filterId: string) => void;
}

export function UsuariosRolFilterBar({
  roles,
  selectedFilter,
  onFilterSelected,
}: UsuariosRolFilterBarProps) {
  const filters = [
    {
      id: USUARIOS_ROL_FILTER_ALL,
      label: "Todos",
      icon: Squares2X2Icon,
    },
    ...roles.map((rol) => ({
      id: usuariosRolFilterId(rol.id),
      label: rol.rol,
      icon: ShieldCheckIcon,
    })),
    {
      id: USUARIOS_ROL_FILTER_SIN_ROL,
      label: "Sin rol",
      icon: UserMinusIcon,
    },
  ];

  return (
    <div className="custom-scrollbar mx-2 mt-4 mb-3 flex gap-2 overflow-x-auto pb-1 sm:mx-3 md:mx-4">
      {filters.map((filter) => {
        const isSelected = selectedFilter === filter.id;
        const Icon = filter.icon;

        return (
          <button
            key={filter.id}
            type="button"
            title={filter.label}
            onClick={() => onFilterSelected(filter.id)}
            className={clsx(
              "inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors",
              isSelected
                ? "border-primary-500 bg-primary-600 text-white"
                : "dark:border-dark-500 dark:bg-dark-700 dark:text-dark-100 dark:hover:bg-dark-600 border-gray-200 bg-white text-gray-800 hover:bg-gray-50",
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="max-w-40 truncate">{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
}
