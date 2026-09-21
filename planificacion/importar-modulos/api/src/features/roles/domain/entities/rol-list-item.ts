export interface RolListItemProps {
  idRol: number;
  idNegocio: number;
  rol: string;
  descripcion: string;
  anulado: boolean;
  modulosCount: number;
}

export class RolListItem {
  constructor(private readonly props: RolListItemProps) {}

  toPrimitives(): RolListItemProps {
    return { ...this.props };
  }
}
