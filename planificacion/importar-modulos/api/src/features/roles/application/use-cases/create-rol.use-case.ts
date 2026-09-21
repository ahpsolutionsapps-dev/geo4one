import { ConflictError, ValidationError } from '../../../../core/errors/app-error';
import { ModuloRepository } from '../../../auth/domain/repositories/modulo-repository';
import { isSuperAdminRolName } from '../../domain/constants/roles.constants';
import { RolDetailProps } from '../../domain/entities/rol-detail';
import { RolRepository } from '../../domain/repositories/rol-repository';
import { ensureAssignableModulos } from '../helpers/ensure-assignable-modulos';

export interface CreateRolUseCaseInput {
  idNegocio: number;
  rol: string;
  descripcion: string;
  idUsuarioRegistra: number;
  idModulos?: number[];
  isSuperAdmin?: boolean;
}

export class CreateRolUseCase {
  constructor(
    private readonly roles: RolRepository,
    private readonly modulos: ModuloRepository,
  ) {}

  async execute(input: CreateRolUseCaseInput): Promise<RolDetailProps> {
    const rol = input.rol.trim();
    const descripcion = input.descripcion.trim();
    const isSuperAdmin = input.isSuperAdmin === true;

    if (!isSuperAdmin && isSuperAdminRolName(rol)) {
      throw new ValidationError('No puedes crear el rol Super Administrador');
    }
    const idModulos = await ensureAssignableModulos(
      this.modulos,
      input.idModulos ?? [],
      { allowHidden: isSuperAdmin },
    );

    const existing = await this.roles.findByNombre(rol, input.idNegocio);
    if (existing && !existing.toPrimitives().anulado) {
      throw new ConflictError('Ya existe un rol con ese nombre');
    }

    if (isSuperAdmin) {
      await this.modulos.enableByIds(idModulos);
    }

    const created = await this.roles.create({
      idNegocio: input.idNegocio,
      rol,
      descripcion,
      idUsuarioRegistra: input.idUsuarioRegistra,
      idModulos,
    });

    return created.toPrimitives();
  }
}
