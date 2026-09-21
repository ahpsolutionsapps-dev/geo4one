import { Usuario } from '../entities/usuario';

export interface FindUsuariosFilters {
  includeAnulados?: boolean;
  excludeSuperAdmin?: boolean;
}

export interface CreateUsuarioInput {
  idNegocio: number;
  username: string;
  email: string;
  userpassword: string;
  nombre?: string;
  apellido?: string | null;
  telefono?: string | null;
  idRol?: number | null;
  palabraSecreta?: string | null;
  habilitado?: boolean;
  verificado?: boolean;
  estatus?: number;
  idioma?: string;
  tema?: string;
  comentario?: string | null;
  idUsuarioRegistra: number;
}

export interface UpdateUsuarioInput {
  username?: string;
  email?: string;
  userpassword?: string;
  nombre?: string;
  apellido?: string | null;
  telefono?: string | null;
  idRol?: number | null;
  palabraSecreta?: string | null;
  habilitado?: boolean;
  verificado?: boolean;
  estatus?: number;
  idioma?: string;
  tema?: string;
  comentario?: string | null;
  imagen?: string | null;
  idUsuarioModifica: number;
}

export interface UsuarioRepository {
  findMany(filters?: FindUsuariosFilters): Promise<Usuario[]>;
  findById(idUsuario: number): Promise<Usuario | null>;
  findByUsername(username: string): Promise<Usuario | null>;
  findByEmail(email: string): Promise<Usuario | null>;
  findRolNameById(idRol: number): Promise<string | null>;
  create(input: CreateUsuarioInput): Promise<Usuario>;
  update(idUsuario: number, input: UpdateUsuarioInput): Promise<Usuario>;
  softDelete(idUsuario: number, idUsuarioAnula: number): Promise<Usuario>;
}
