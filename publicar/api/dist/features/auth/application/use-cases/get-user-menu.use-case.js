"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserMenuUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
function resolveId(modulo) {
    if (modulo.codigo && modulo.codigo.trim() !== '') {
        return modulo.codigo;
    }
    return `modulo-${modulo.idModulo}`;
}
function resolveIcon(modulo, fallback) {
    if (modulo.icono && modulo.icono.trim() !== '') {
        return modulo.icono;
    }
    return fallback;
}
function isSuperAdminRolName(rol) {
    return rol.trim().toLowerCase() === 'super administrador';
}
function isRemovedDashboardModulo(modulo) {
    const codigo = (modulo.codigo ?? '').trim().toLowerCase();
    const ruta = (modulo.ruta ?? '').trim().toLowerCase();
    return codigo === 'dashboard_basic' || ruta === '/dashboards/basic';
}
function sortByOrder(modulos) {
    return [...modulos].sort((a, b) => {
        const orderDiff = (a.orderIndex ?? 0) - (b.orderIndex ?? 0);
        if (orderDiff !== 0) {
            return orderDiff;
        }
        return a.idModulo - b.idModulo;
    });
}
function buildMenuTree(modulos) {
    const byParent = new Map();
    for (const modulo of modulos) {
        const key = modulo.idPadre;
        const bucket = byParent.get(key) ?? [];
        bucket.push(modulo);
        byParent.set(key, bucket);
    }
    const roots = sortByOrder(byParent.get(null) ?? []);
    return roots
        .map((section) => {
        const children = sortByOrder(byParent.get(section.idModulo) ?? []);
        const items = children.map((child) => ({
            id: resolveId(child),
            title: child.nombreModulo,
            iconKey: resolveIcon(child, 'home'),
            path: child.ruta,
        }));
        const sectionPath = section.ruta ??
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
class GetUserMenuUseCase {
    userRepository;
    moduloRepository;
    constructor(userRepository, moduloRepository) {
        this.userRepository = userRepository;
        this.moduloRepository = moduloRepository;
    }
    async execute(idUsuario) {
        const user = await this.userRepository.findById(idUsuario);
        if (!user || user.anulado || !user.habilitado) {
            throw new app_error_1.UnauthorizedError();
        }
        if (!user.canAccessModules() || user.idRol == null) {
            return { sections: [], modules: [], idRol: user.idRol };
        }
        const rolName = await this.userRepository.findRolName(idUsuario);
        const includeHidden = isSuperAdminRolName(rolName ?? '');
        const modulos = (await this.moduloRepository.findByRolId(user.idRol, { includeHidden })).filter((modulo) => (includeHidden || !modulo.oculto) && !isRemovedDashboardModulo(modulo));
        const modules = modulos.map((modulo) => ({
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
exports.GetUserMenuUseCase = GetUserMenuUseCase;
//# sourceMappingURL=get-user-menu.use-case.js.map