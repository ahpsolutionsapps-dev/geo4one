import {
  CreateUsuarioInput,
  UpdateUsuarioInput,
  Usuario,
} from "../../domain/entities/usuario.entity";
import { Rol } from "../../domain/entities/rol.entity";
import { UsuariosRepository } from "../../domain/repositories/usuarios.repository";
import { UsuariosRemoteDataSource } from "../datasources/usuarios-remote.datasource";

export class UsuariosRepositoryImpl implements UsuariosRepository {
  constructor(private readonly remoteDataSource: UsuariosRemoteDataSource) {}

  getUsuarios(): Promise<Usuario[]> {
    return this.remoteDataSource.getUsuarios();
  }

  getRoles(): Promise<Rol[]> {
    return this.remoteDataSource.getRoles();
  }

  createUsuario(input: CreateUsuarioInput): Promise<Usuario> {
    return this.remoteDataSource.createUsuario(input);
  }

  updateUsuario(input: UpdateUsuarioInput): Promise<Usuario> {
    return this.remoteDataSource.updateUsuario(input);
  }

  anularUsuario(id: string): Promise<void> {
    return this.remoteDataSource.anularUsuario(id);
  }

  uploadUsuarioImagen(id: string, file: File): Promise<Usuario> {
    return this.remoteDataSource.uploadUsuarioImagen(id, file);
  }

  deleteUsuarioImagen(id: string): Promise<Usuario> {
    return this.remoteDataSource.deleteUsuarioImagen(id);
  }
}
