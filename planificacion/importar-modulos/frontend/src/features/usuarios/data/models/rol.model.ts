import { Rol } from "../../domain/entities/rol.entity";

export interface RolApiModel {
  idRol: number;
  idNegocio?: number;
  rol: string;
  descripcion: string;
}

export function mapRolFromApi(model: RolApiModel): Rol {
  return {
    id: String(model.idRol),
    rol: model.rol,
    descripcion: model.descripcion,
  };
}
