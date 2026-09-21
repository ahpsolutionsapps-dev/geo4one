import { UsuariosRemoteDataSource } from "../data/datasources/usuarios-remote.datasource";
import { UsuariosRepositoryImpl } from "../data/repositories/usuarios.repository.impl";
import { AnularUsuarioUseCase } from "../domain/usecases/anular-usuario.usecase";
import { CreateUsuarioUseCase } from "../domain/usecases/create-usuario.usecase";
import { DeleteUsuarioImagenUseCase } from "../domain/usecases/delete-usuario-imagen.usecase";
import { GetRolesUseCase } from "../domain/usecases/get-roles.usecase";
import { GetUsuariosUseCase } from "../domain/usecases/get-usuarios.usecase";
import { UpdateUsuarioUseCase } from "../domain/usecases/update-usuario.usecase";
import { UploadUsuarioImagenUseCase } from "../domain/usecases/upload-usuario-imagen.usecase";

const remoteDataSource = new UsuariosRemoteDataSource();
const repository = new UsuariosRepositoryImpl(remoteDataSource);

export function buildUsuariosModule() {
  return {
    getUsuarios: new GetUsuariosUseCase(repository),
    getRoles: new GetRolesUseCase(repository),
    createUsuario: new CreateUsuarioUseCase(repository),
    updateUsuario: new UpdateUsuarioUseCase(repository),
    anularUsuario: new AnularUsuarioUseCase(repository),
    uploadUsuarioImagen: new UploadUsuarioImagenUseCase(repository),
    deleteUsuarioImagen: new DeleteUsuarioImagenUseCase(repository),
  };
}

export type UsuariosModule = ReturnType<typeof buildUsuariosModule>;

export const usuariosModule = buildUsuariosModule();
