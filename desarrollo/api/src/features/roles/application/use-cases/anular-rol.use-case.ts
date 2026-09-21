import { NotFoundError } from '../../../../core/errors/app-error';
import { assertRolMutable, isSuperAdminRolName } from '../../domain/constants/roles.constants';
import { RolRepository } from '../../domain/repositories/rol-repository';

export class AnularRolUseCase {
  constructor(private readonly roles: RolRepository) {}

  async execute(
    idRol: number,
    idNegocio: number,
    idUsuarioAnula: number,
    options?: { isSuperAdmin?: boolean },
  ): Promise<void> {
    const existing = await this.roles.findById(idRol, idNegocio);
    if (!existing) {
      throw new NotFoundError('Rol no encontrado');
    }

    const props = existing.toPrimitives();
    if (options?.isSuperAdmin !== true && isSuperAdminRolName(props.rol)) {
      throw new NotFoundError('Rol no encontrado');
    }

    assertRolMutable(props);

    if (props.anulado) {
      return;
    }

    await this.roles.softDelete(idRol, idNegocio, idUsuarioAnula);
  }
}
