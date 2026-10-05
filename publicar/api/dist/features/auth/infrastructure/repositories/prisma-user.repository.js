"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const user_1 = require("../../domain/entities/user");
function toDomain(row) {
    return new user_1.User({
        idUsuario: row.idUsuario,
        idNegocio: row.idNegocio,
        username: row.username,
        email: row.email,
        userpassword: row.passwordHash,
        nombre: row.nombre,
        apellido: row.apellido,
        telefono: row.telefono,
        idRol: row.idRol,
        palabraSecreta: row.palabraSecreta,
        habilitado: row.habilitado,
        imagen: row.imagen,
        idUsuarioRegistra: row.idUsuarioRegistra,
        fechaCreacion: row.fechaCreacion,
        idUsuarioModifica: row.idUsuarioModifica,
        fechaModificacion: row.fechaModificacion,
        anulado: row.anulado,
        idUsuarioAnula: row.idUsuarioAnula,
        fechaAnulado: row.fechaAnulado,
        comentario: row.comentario,
        verificado: row.verificado,
        estatus: row.estatus,
        idioma: row.idioma,
        tema: row.tema,
        intentosFallidos: row.intentosFallidos,
        ultimoAcceso: row.ultimoAcceso,
        bloqueadoHasta: row.bloqueadoHasta,
    });
}
class PrismaUserRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(idUsuario) {
        const row = await this.prisma.usuario.findUnique({ where: { idUsuario } });
        return row ? toDomain(row) : null;
    }
    async findByUsername(username) {
        const row = await this.prisma.usuario.findUnique({ where: { username } });
        return row ? toDomain(row) : null;
    }
    async findByEmail(email) {
        const row = await this.prisma.usuario.findFirst({
            where: { email: email.trim() },
        });
        return row ? toDomain(row) : null;
    }
    async findRolName(idUsuario) {
        const row = await this.prisma.usuario.findUnique({
            where: { idUsuario },
            select: { rol: { select: { rol: true } } },
        });
        return row?.rol?.rol ?? null;
    }
    async create(input) {
        const row = await this.prisma.usuario.create({
            data: {
                idNegocio: input.idNegocio,
                username: input.username,
                email: input.email,
                passwordHash: input.userpassword,
                nombre: input.nombre,
                apellido: input.apellido ?? null,
                telefono: input.telefono ?? null,
                idRol: input.idRol,
                palabraSecreta: input.palabraSecreta,
                habilitado: input.habilitado,
                imagen: input.imagen,
                idUsuarioRegistra: input.idUsuarioRegistra,
                fechaCreacion: input.fechaCreacion,
                idUsuarioModifica: input.idUsuarioModifica,
                fechaModificacion: input.fechaModificacion,
                anulado: input.anulado,
                idUsuarioAnula: input.idUsuarioAnula,
                fechaAnulado: input.fechaAnulado,
                comentario: input.comentario,
                verificado: input.verificado ?? false,
                estatus: input.estatus ?? 1,
                idioma: input.idioma ?? 'es',
                tema: input.tema ?? 'sistema',
                intentosFallidos: input.intentosFallidos ?? 0,
            },
        });
        return toDomain(row);
    }
    async updatePassword(idUsuario, userpassword) {
        await this.prisma.usuario.update({
            where: { idUsuario },
            data: {
                passwordHash: userpassword,
                fechaModificacion: new Date(),
                idUsuarioModifica: idUsuario,
            },
        });
    }
    async getThemePreferences(idUsuario) {
        const row = await this.prisma.usuario.findUnique({
            where: { idUsuario },
            select: {
                primaryColor: true,
                tema: true,
                darkColorScheme: true,
            },
        });
        return row ?? null;
    }
    async updateThemePreferences(idUsuario, data) {
        await this.prisma.usuario.update({
            where: { idUsuario },
            data: {
                ...data,
                fechaModificacion: new Date(),
                idUsuarioModifica: idUsuario,
            },
        });
    }
}
exports.PrismaUserRepository = PrismaUserRepository;
//# sourceMappingURL=prisma-user.repository.js.map