import { ValidationError } from '../../../../core/errors/app-error';

export const SUPER_ADMIN_ROL_NAME = 'Super Administrador';
export const ADMIN_ROL_NAMES = ['Super Administrador', 'Administrador'] as const;
export const PRIVILEGED_DASHBOARD_ROL_IDS = [1, 2] as const;

export function isSuperAdminRolName(rol: string): boolean {
  return rol.trim().toLowerCase() === SUPER_ADMIN_ROL_NAME.toLowerCase();
}

export function isAdminRolName(rol: string): boolean {
  const normalized = rol.trim().toLowerCase();
  return ADMIN_ROL_NAMES.some((name) => name.toLowerCase() === normalized);
}

export function isPrivilegedDashboardRolId(idRol: number | null | undefined): boolean {
  if (idRol == null) {
    return false;
  }

  return PRIVILEGED_DASHBOARD_ROL_IDS.includes(
    idRol as (typeof PRIVILEGED_DASHBOARD_ROL_IDS)[number],
  );
}

export function assertRolMutable(rol: { rol: string }): void {
  if (isSuperAdminRolName(rol.rol)) {
    throw new ValidationError(
      'El rol Super Administrador no puede anularse ni modificarse de forma destructiva',
    );
  }
}
