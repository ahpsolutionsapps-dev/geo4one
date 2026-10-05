"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaRolRepository = void 0;
const roles_constants_1 = require("../../domain/constants/roles.constants");
const rol_detail_1 = require("../../domain/entities/rol-detail");
const rol_list_item_1 = require("../../domain/entities/rol-list-item");
class PrismaRolRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany(filters) {
        const rows = await this.prisma.rol.findMany({
            where: {
                idNegocio: filters.idNegocio,
                ...(filters.includeAnulados ? {} : { anulado: false }),
                ...(filters.excludeSuperAdmin
                    ? {
                        NOT: {
                            rol: { equals: roles_constants_1.SUPER_ADMIN_ROL_NAME, mode: 'insensitive' },
                        },
                    }
                    : {}),
            },
            orderBy: { rol: 'asc' },
            select: {
                idRol: true,
                idNegocio: true,
                rol: true,
                descripcion: true,
                anulado: true,
                _count: {
                    select: {
                        rolModulos: { where: { modulo: { oculto: false } } },
                    },
                },
            },
        });
        return rows.map((row) => new rol_list_item_1.RolListItem({
            idRol: row.idRol,
            idNegocio: row.idNegocio,
            rol: row.rol,
            descripcion: row.descripcion,
            anulado: row.anulado,
            modulosCount: row._count.rolModulos,
        }));
    }
    async findById(idRol, idNegocio) {
        const row = await this.prisma.rol.findFirst({
            where: { idRol, idNegocio },
            select: {
                idRol: true,
                idNegocio: true,
                rol: true,
                descripcion: true,
                anulado: true,
                comentario: true,
                rolModulos: {
                    select: { idModulo: true },
                },
            },
        });
        if (!row) {
            return null;
        }
        return new rol_detail_1.RolDetail({
            idRol: row.idRol,
            idNegocio: row.idNegocio,
            rol: row.rol,
            descripcion: row.descripcion,
            anulado: row.anulado,
            comentario: row.comentario,
            idModulos: row.rolModulos.map((item) => item.idModulo),
        });
    }
    async findByNombre(rol, idNegocio) {
        const row = await this.prisma.rol.findFirst({
            where: { rol, idNegocio },
            select: { idRol: true },
        });
        if (!row) {
            return null;
        }
        return this.findById(row.idRol, idNegocio);
    }
    async create(input) {
        const row = await this.prisma.rol.create({
            data: {
                idNegocio: input.idNegocio,
                rol: input.rol,
                descripcion: input.descripcion,
                idUsuarioRegistra: input.idUsuarioRegistra,
                anulado: false,
                rolModulos: {
                    create: input.idModulos.map((idModulo) => ({ idModulo })),
                },
            },
            select: { idRol: true },
        });
        const created = await this.findById(row.idRol, input.idNegocio);
        if (!created) {
            throw new Error('No se pudo leer el rol creado');
        }
        return created;
    }
    async update(idRol, idNegocio, input) {
        await this.prisma.$transaction(async (tx) => {
            const updated = await tx.rol.updateMany({
                where: { idRol, idNegocio },
                data: {
                    rol: input.rol,
                    descripcion: input.descripcion,
                    idUsuarioModifica: input.idUsuarioModifica,
                    fechaModificacion: new Date(),
                    comentario: input.comentario === undefined ? undefined : input.comentario,
                },
            });
            if (updated.count === 0) {
                throw new Error('Rol no encontrado');
            }
            if (input.idModulos !== undefined) {
                await tx.rolModulo.deleteMany({ where: { idRol } });
                if (input.idModulos.length > 0) {
                    await tx.rolModulo.createMany({
                        data: input.idModulos.map((idModulo) => ({ idRol, idModulo })),
                    });
                }
            }
        });
        const updated = await this.findById(idRol, idNegocio);
        if (!updated) {
            throw new Error('No se pudo leer el rol actualizado');
        }
        return updated;
    }
    async softDelete(idRol, idNegocio, idUsuarioAnula) {
        const result = await this.prisma.rol.updateMany({
            where: { idRol, idNegocio },
            data: {
                anulado: true,
                idUsuarioAnula,
                fechaAnulado: new Date(),
            },
        });
        if (result.count === 0) {
            throw new Error('Rol no encontrado');
        }
    }
    async replaceModulos(idRol, idNegocio, idModulos) {
        const existing = await this.prisma.rol.findFirst({
            where: { idRol, idNegocio },
            select: { idRol: true },
        });
        if (!existing) {
            throw new Error('Rol no encontrado');
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.rolModulo.deleteMany({ where: { idRol } });
            if (idModulos.length > 0) {
                await tx.rolModulo.createMany({
                    data: idModulos.map((idModulo) => ({ idRol, idModulo })),
                });
            }
        });
    }
}
exports.PrismaRolRepository = PrismaRolRepository;
//# sourceMappingURL=prisma-rol.repository.js.map