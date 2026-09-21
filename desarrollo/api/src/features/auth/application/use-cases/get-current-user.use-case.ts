import { NotFoundError, UnauthorizedError } from '../../../../core/errors/app-error';
import { UserRepository } from '../../domain/repositories/user-repository';
import { PublicUserDTO } from '../dto/auth-response.dto';

export interface CurrentUserResult {
  user: PublicUserDTO;
  idSucursal: number | null;
}

export class GetCurrentUserUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(idUsuario: number): Promise<CurrentUserResult> {
    const user = await this.users.findById(idUsuario);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }
    if (!user.canLogin()) {
      throw new UnauthorizedError(
        user.anulado
          ? 'Tu cuenta ha sido anulada'
          : 'Tu cuenta está deshabilitada',
      );
    }
    const idSucursal = await this.users.findPrincipalSucursalId(idUsuario);
    return { user: user.toPublic(), idSucursal };
  }
}
