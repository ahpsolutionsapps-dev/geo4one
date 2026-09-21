import { Modulo } from '../entities/modulo';

export interface FindModulosOptions {
  includeHidden?: boolean;
}

export interface ModuloRepository {
  findByRolId(idRol: number, options?: FindModulosOptions): Promise<Modulo[]>;
  findAll(options?: FindModulosOptions): Promise<Modulo[]>;
  findHiddenIds(ids: number[]): Promise<number[]>;
  findAssignedHiddenIds(idRol: number): Promise<number[]>;
  enableByIds(ids: number[]): Promise<void>;
}
