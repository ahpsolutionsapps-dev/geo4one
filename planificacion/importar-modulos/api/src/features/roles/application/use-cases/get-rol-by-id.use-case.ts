import { NotFoundError } from '../../../../core/errors/app-error';
import { ModuloRepository } from '../../../auth/domain/repositories/modulo-repository';
import { isSuperAdminRolName } from '../../domain/constants/roles.constants';
import { RolDetailProps } from '../../domain/entities/rol-detail';
import { RolRepository } from '../../domain/repositories/rol-repository';

export class GetRolByIdUseCase {
  constructor(
    private readonly roles: RolRepository,
    private readonly modulos: ModuloRepository,
  ) {}

  async execute(
    idRol: number,
    idNegocio: number,
    options?: { includeHiddenModulos?: boolean; hideSuperAdmin?: boolean },
  ): Promise<RolDetailProps> {
    const rol = await this.roles.findById(idRol, idNegocio);
    if (!rol) {
      throw new NotFoundError('Rol no encontrado');
    }

    const props = rol.toPrimitives();
    if (options?.hideSuperAdmin === true && isSuperAdminRolName(props.rol)) {
      throw new NotFoundError('Rol no encontrado');
    }
    if (options?.includeHiddenModulos === true) {
      return props;
    }

    const hiddenIds = await this.modulos.findHiddenIds(props.idModulos);
    if (hiddenIds.length === 0) {
      return props;
    }

    const hiddenSet = new Set(hiddenIds);
    return {
      ...props,
      idModulos: props.idModulos.filter((idModulo) => !hiddenSet.has(idModulo)),
    };
  }
}
