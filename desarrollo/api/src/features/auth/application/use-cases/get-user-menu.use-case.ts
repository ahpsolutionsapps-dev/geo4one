import { UnauthorizedError } from '../../../../core/errors/app-error';
import { Modulo } from '../../domain/entities/modulo';
import { ModuloRepository } from '../../domain/repositories/modulo-repository';
import { UserRepository } from '../../domain/repositories/user-repository';
import {
  MenuItemDto,
  MenuModuleDto,
  MenuResponseDto,
  MenuSectionDto,
} from '../dto/menu-response.dto';

function resolveId(modulo: Modulo): string {
  if (modulo.codigo && modulo.codigo.trim() !== '') {
    return modulo.codigo;
  }

  return `modulo-${modulo.idModulo}`;
}

function resolveIcon(modulo: Modulo, fallback: string): string {
  if (modulo.icono && modulo.icono.trim() !== '') {
    return modulo.icono;
  }

  return fallback;
}

function isSuperAdminRolName(rol: string): boolean {
  return rol.trim().toLowerCase() === 'super administrador';
}

function isRemovedDashboardModulo(modulo: Modulo): boolean {
  const codigo = (modulo.codigo ?? '').trim().toLowerCase();
  const ruta = (modulo.ruta ?? '').trim().toLowerCase();
  return codigo === 'dashboard_basic' || ruta === '/dashboards/basic';
}

function sortByOrder(modulos: Modulo[]): Modulo[] {
  return [...modulos].sort((a, b) => {
    const orderDiff = (a.orderIndex ?? 0) - (b.orderIndex ?? 0);
    if (orderDiff !== 0) {
      return orderDiff;
    }
    return a.idModulo - b.idModulo;
  });
}

function buildMenuTree(modulos: Modulo[]): MenuSectionDto[] {
  const byParent = new Map<number | null, Modulo[]>();

  for (const modulo of modulos) {
    const key = modulo.idPadre;
    const bucket = byParent.get(key) ?? [];
    bucket.push(modulo);
    byParent.set(key, bucket);
  }

  const roots = sortByOrder(byParent.get(null) ?? []);

  return roots
    .map((section): MenuSectionDto => {
      const children = sortByOrder(byParent.get(section.idModulo) ?? []);
      const items: MenuItemDto[] = children.map((child) => ({
        id: resolveId(child),
        title: child.nombreModulo,
        iconKey: resolveIcon(child, 'home'),
        path: child.ruta,
      }));

      const sectionPath =
        section.ruta ??
        items.find((item) => typeof item.path === 'string' && item.path.length > 0)?.path ??
        null;

      return {
        id: resolveId(section),
        title: section.nombreModulo,
        sectionIconKey: resolveIcon(section, 'dashboards'),
        path: sectionPath,
        items,
      };
    })
    .filter((section) => section.items.length > 0);
}

export class GetUserMenuUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly moduloRepository: ModuloRepository,
  ) {}

  async execute(idUsuario: number): Promise<MenuResponseDto> {
    const user = await this.userRepository.findById(idUsuario);
    if (!user || user.anulado || !user.habilitado) {
      throw new UnauthorizedError();
    }

    if (!user.canAccessModules() || user.idRol == null) {
      return { sections: [], modules: [], idRol: user.idRol };
    }

    const rolName = await this.userRepository.findRolName(idUsuario);
    const includeHidden = isSuperAdminRolName(rolName ?? '');
    const modulos = (
      await this.moduloRepository.findByRolId(user.idRol, { includeHidden })
    ).filter(
      (modulo) =>
        (includeHidden || !modulo.oculto) && !isRemovedDashboardModulo(modulo),
    );
    const modules: MenuModuleDto[] = modulos.map((modulo) => ({
      idModulo: modulo.idModulo,
      codigo: modulo.codigo,
      nombreModulo: modulo.nombreModulo,
      icono: modulo.icono,
      ruta: modulo.ruta,
      idPadre: modulo.idPadre,
      orderIndex: modulo.orderIndex,
    }));

    return {
      sections: buildMenuTree(modulos),
      modules,
      idRol: user.idRol,
    };
  }
}
