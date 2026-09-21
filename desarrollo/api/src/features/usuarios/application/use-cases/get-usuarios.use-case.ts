import { UsuarioResponse, toUsuarioResponse } from '../mappers/usuario-response.mapper';
import {
  FindUsuariosFilters,
  UsuarioRepository,
} from '../../domain/repositories/usuario-repository';

export class GetUsuariosUseCase {
  constructor(private readonly usuarios: UsuarioRepository) {}

  async execute(filters?: FindUsuariosFilters): Promise<UsuarioResponse[]> {
    const rows = await this.usuarios.findMany(filters);
    return rows.map((row) => toUsuarioResponse(row.toPrimitives()));
  }
}
