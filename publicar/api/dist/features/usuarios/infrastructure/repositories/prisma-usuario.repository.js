"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUsuarioRepository = void 0;
const roles_constants_1 = require("../../../roles/domain/constants/roles.constants");
const usuario_1 = require("../../domain/entities/usuario");
function toDomain(row) {
    return new usuario_1.Usuario({
        idUsuario: row.idUsuario,
        idNegocio: row.idNegocio,
        username: row.username,
        email: row.email,
        nombre: row.nombre,
        apellido: row.apellido,
        telefono: row.telefono,
        idRol: row.idRol,
        rol: row.rol?.rol ?? null,
        palabraSecreta: row.palabraSecreta,
        habilitado: row.habilitado,
        imagen: row.imagen,
        verificado: row.verificado,
        estatus: row.estatus,
        idioma: row.idioma,
        tema: row.tema,
        comentario: row.comentario,
        fechaCreacion: row.fechaCreacion,
        fechaModificacion: row.fechaModificacion,
        anulado: row.anulado,
    });
}
const includeRol = { rol: { select: { rol: true } } };
class PrismaUsuarioRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany(filters) {
        const rows = await this.prisma.usuario.findMany({
            where: {
                ...(filters?.includeAnulados ? {} : { anulado: false }),
                ...(filters?.excludeSuperAdmin
                    ? {
                        NOT: {
                            rol: {
                                is: {
                                    rol: { equals: roles_constants_1.SUPER_ADMIN_ROL_NAME, mode: 'insensitive' },
                                },
                            },
                        },
                    }
                    : {}),
            },
            include: includeRol,
            orderBy: { username: 'asc' },
        });
        return rows.map(toDomain);
    }
    async findById(idUsuario) {
        const row = await this.prisma.usuario.findUnique({
            where: { idUsuario },
            include: includeRol,
        });
        return row ? toDomain(row) : null;
    }
    async findByUsername(username) {
        const row = await this.prisma.usuario.findUnique({
            where: { username },
            include: includeRol,
        });
        return row ? toDomain(row) : null;
    }
    async findByEmail(email) {
        const row = await this.prisma.usuario.findFirst({
            where: { email },
            include: includeRol,
        });
        return row ? toDomain(row) : null;
    }
    async findRolNameById(idRol) {
        const row = await this.prisma.rol.findUnique({
            where: { idRol },
            select: { rol: true },
        });
        return row?.rol ?? null;
    }
    async create(input) {
        const row = await this.prisma.usuario.create({
            data: {
                idNegocio: input.idNegocio,
                username: input.username,
                email: input.email,
                passwordHash: input.userpassword,
                nombre: input.nombre?.trim() || input.username,
                apellido: input.apellido?.trim() || null,
                telefono: input.telefono?.trim() || null,
                idRol: input.idRol ?? null,
                palabraSecreta: input.palabraSecreta ?? null,
                habilitado: input.habilitado !== false,
                imagen: null,
                idUsuarioRegistra: input.idUsuarioRegistra,
                idUsuarioModifica: null,
                fechaModificacion: null,
                anulado: false,
                idUsuarioAnula: null,
                fechaAnulado: null,
                comentario: input.comentario ?? null,
                verificado: input.verificado === true,
                estatus: input.estatus ?? 1,
                idioma: input.idioma ?? 'es',
                tema: input.tema ?? 'sistema',
            },
            include: includeRol,
        });
        return toDomain(row);
    }
    async update(idUsuario, input) {
        const existing = await this.prisma.usuario.findUnique({
            where: { idUsuario },
        });
        if (!existing) {
            throw new Error('Usuario no encontrado');
        }
        const row = await this.prisma.usuario.update({
            where: { idUsuario },
            data: {
                username: input.username ?? existing.username,
                email: input.email ?? existing.email,
                passwordHash: input.userpassword ?? existing.passwordHash,
                nombre: input.nombre?.trim() ?? existing.nombre,
                apellido: input.apellido !== undefined
                    ? input.apellido?.trim() || null
                    : existing.apellido,
                telefono: input.telefono !== undefined
                    ? input.telefono?.trim() || null
                    : existing.telefono,
                idRol: input.idRol !== undefined ? input.idRol : existing.idRol,
                palabraSecreta: input.palabraSecreta !== undefined
                    ? input.palabraSecreta
                    : existing.palabraSecreta,
                habilitado: input.habilitado !== undefined
                    ? input.habilitado
                    : existing.habilitado,
                imagen: input.imagen !== undefined ? input.imagen : existing.imagen,
                verificado: input.verificado !== undefined
                    ? input.verificado
                    : existing.verificado,
                estatus: input.estatus ?? existing.estatus,
                idioma: input.idioma ?? existing.idioma,
                tema: input.tema ?? existing.tema,
                comentario: input.comentario !== undefined ? input.comentario : existing.comentario,
                fechaModificacion: new Date(),
                idUsuarioModifica: input.idUsuarioModifica,
            },
            include: includeRol,
        });
        return toDomain(row);
    }
    async softDelete(idUsuario, idUsuarioAnula) {
        const row = await this.prisma.usuario.update({
            where: { idUsuario },
            data: {
                anulado: true,
                habilitado: false,
                fechaAnulado: new Date(),
                idUsuarioAnula,
            },
            include: includeRol,
        });
        return toDomain(row);
    }
}
exports.PrismaUsuarioRepository = PrismaUsuarioRepository;
//# sourceMappingURL=prisma-usuario.repository.js.map