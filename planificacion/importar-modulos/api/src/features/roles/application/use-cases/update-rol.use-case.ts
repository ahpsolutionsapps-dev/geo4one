import { ConflictError, NotFoundError, ValidationError } from '../../../../core/errors/app-error';
import { ModuloRepository } from '../../../auth/domain/repositories/modulo-repository';
import { isSuperAdminRolName } from '../../domain/constants/roles.constants';
import { RolDetailProps } from '../../domain/entities/rol-detail';
import { RolRepository } from '../../domain/repositories/rol-repository';
import { ensureAssignableModulos } from '../helpers/ensure-assignable-modulos';

export interface UpdateRolUseCaseInput {
  rol: string;
  descripcion: string;
  idUsuarioModifica: number;
  idModulos?: number[];
  comentario?: string | null;
  isSuperAdmin?: boolean;
}

export class UpdateRolUseCase {
  constructor(
    private readonly roles: RolRepository,
    private readonly modulos: ModuloRepository,
  ) {}

  async execute(
    idRol: number,
    idNegocio: number,
    input: UpdateRolUseCaseInput,
  ): Promise<RolDetailProps> {
    const existing = await this.roles.findById(idRol, idNegocio);
    if (!existing) {
      throw new NotFoundError('Rol no encontrado');
    }

    const existingProps = existing.toPrimitives();
    const rol = input.rol.trim();
    const descripcion = input.descripcion.trim();
    const isSuperAdmin = input.isSuperAdmin === true;

    if (!isSuperAdmin && isSuperAdminRolName(existingProps.rol)) {
      throw new NotFoundError('Rol no encontrado');
    }

    if (!isSuperAdmin && isSuperAdminRolName(rol)) {
      throw new ValidationError('No puedes asignar el nombre Super Administrador');
    }
    let idModulos =
      input.idModulos === undefined
        ? undefined
        : await ensureAssignableModulos(this.modulos, input.idModulos, {
            allowHidden: isSuperAdmin,
          });

    if (isSuperAdminRolName(existingProps.rol) && rol !== existingProps.rol) {
      throw new ConflictError('No se puede renombrar el rol Super Administrador');
    }

    const byName = await this.roles.findByNombre(rol, idNegocio);
    if (
      byName &&
      byName.toPrimitives().idRol !== idRol &&
      !byName.toPrimitives().anulado
    ) {
      throw new ConflictError('Ya existe un rol con ese nombre');
    }

    if (idModulos !== undefined && !isSuperAdmin) {
      const hiddenAssigned = await this.modulos.findAssignedHiddenIds(idRol);
      idModulos = [...new Set([...idModulos, ...hiddenAssigned])];
    }

    if (idModulos !== undefined && isSuperAdmin) {
      const previouslyAssigned = new Set(existingProps.idModulos);
      const newlyAssigned = idModulos.filter((id) => !previouslyAssigned.has(id));
      await this.modulos.enableByIds(newlyAssigned);
    }

    const updated = await this.roles.update(idRol, idNegocio, {
      rol,
      descripcion,
      idUsuarioModifica: input.idUsuarioModifica,
      idModulos,
      comentario: input.comentario?.trim() || null,
    });

    return updated.toPrimitives();
  }
}
