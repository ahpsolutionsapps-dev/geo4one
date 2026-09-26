import { Rol } from "../entities/rol.entity";
import {
  CreateUsuarioInput,
  UpdateUsuarioInput,
  Usuario,
} from "../entities/usuario.entity";

export interface UsuariosRepository {
  getUsuarios(): Promise<Usuario[]>;
  getRoles(): Promise<Rol[]>;
  createUsuario(input: CreateUsuarioInput): Promise<Usuario>;
  updateUsuario(input: UpdateUsuarioInput): Promise<Usuario>;
  anularUsuario(id: string): Promise<void>;
  uploadUsuarioImagen(id: string, file: File): Promise<Usuario>;
  deleteUsuarioImagen(id: string): Promise<Usuario>;
}
