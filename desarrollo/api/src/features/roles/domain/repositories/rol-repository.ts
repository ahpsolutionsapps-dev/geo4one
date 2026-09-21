import { RolDetail } from '../entities/rol-detail';
import { RolListItem } from '../entities/rol-list-item';

export interface FindRolesFilters {
  includeAnulados?: boolean;
  excludeSuperAdmin?: boolean;
  idNegocio: number;
}

export interface CreateRolInput {
  idNegocio: number;
  rol: string;
  descripcion: string;
  idUsuarioRegistra: number;
  idModulos: number[];
}

export interface UpdateRolInput {
  rol: string;
  descripcion: string;
  idUsuarioModifica: number;
  idModulos?: number[];
  comentario?: string | null;
}

export interface RolRepository {
  findMany(filters: FindRolesFilters): Promise<RolListItem[]>;
  findById(idRol: number, idNegocio: number): Promise<RolDetail | null>;
  findByNombre(rol: string, idNegocio: number): Promise<RolDetail | null>;
  create(input: CreateRolInput): Promise<RolDetail>;
  update(idRol: number, idNegocio: number, input: UpdateRolInput): Promise<RolDetail>;
  softDelete(idRol: number, idNegocio: number, idUsuarioAnula: number): Promise<void>;
  replaceModulos(idRol: number, idNegocio: number, idModulos: number[]): Promise<void>;
}
