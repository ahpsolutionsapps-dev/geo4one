import { ValidationError } from '../../../../core/errors/app-error';
import { ModuloRepository } from '../../../auth/domain/repositories/modulo-repository';

export async function ensureAssignableModulos(
  modulos: ModuloRepository,
  idModulos: number[],
  options?: { allowHidden?: boolean },
): Promise<number[]> {
  const unique = [...new Set(idModulos)];
  if (unique.length === 0 || options?.allowHidden === true) {
    return unique;
  }

  const hiddenIds = await modulos.findHiddenIds(unique);
  if (hiddenIds.length > 0) {
    throw new ValidationError('No se pueden asignar módulos ocultos a un rol');
  }

  return unique;
}
