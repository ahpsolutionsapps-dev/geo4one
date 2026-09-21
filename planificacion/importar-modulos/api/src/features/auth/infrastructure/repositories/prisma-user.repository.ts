import { PrismaClient, Usuario as PrismaUsuario } from '@prisma/client';
import { User } from '../../domain/entities/user';
import { NewUserInput, UserRepository, UserThemePreferencesRow } from '../../domain/repositories/user-repository';

function toDomain(row: PrismaUsuario): User {
  return new User({
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

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(idUsuario: number): Promise<User | null> {
    const row = await this.prisma.usuario.findUnique({ where: { idUsuario } });
    return row ? toDomain(row) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const row = await this.prisma.usuario.findUnique({ where: { username } });
    return row ? toDomain(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.prisma.usuario.findFirst({
      where: { email: email.trim() },
    });
    return row ? toDomain(row) : null;
  }

  async findPrincipalSucursalId(idUsuario: number): Promise<number | null> {
    const principal = await this.prisma.usuarioSucursal.findFirst({
      where: {
        idUsuario,
        activo: true,
        anulado: false,
        esPrincipal: true,
      },
      select: { idSucursal: true },
    });
    if (principal) {
      return principal.idSucursal;
    }

    const fallback = await this.prisma.usuarioSucursal.findFirst({
      where: {
        idUsuario,
        activo: true,
        anulado: false,
      },
      orderBy: { idUsuarioSucursal: 'asc' },
      select: { idSucursal: true },
    });
    return fallback?.idSucursal ?? null;
  }

  async findRolName(idUsuario: number): Promise<string | null> {
    const row = await this.prisma.usuario.findUnique({
      where: { idUsuario },
      select: { rol: { select: { rol: true } } },
    });
    return row?.rol?.rol ?? null;
  }

  async create(input: NewUserInput): Promise<User> {
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

  async updatePassword(idUsuario: number, userpassword: string): Promise<void> {
    await this.prisma.usuario.update({
      where: { idUsuario },
      data: {
        passwordHash: userpassword,
        fechaModificacion: new Date(),
        idUsuarioModifica: idUsuario,
      },
    });
  }

  async getThemePreferences(
    idUsuario: number,
  ): Promise<UserThemePreferencesRow | null> {
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

  async updateThemePreferences(
    idUsuario: number,
    data: Partial<{
      primaryColor: string;
      tema: string;
      darkColorScheme: string;
    }>,
  ): Promise<void> {
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
