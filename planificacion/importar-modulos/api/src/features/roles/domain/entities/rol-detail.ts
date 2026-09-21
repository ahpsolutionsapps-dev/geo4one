export interface RolDetailProps {
  idRol: number;
  idNegocio: number;
  rol: string;
  descripcion: string;
  anulado: boolean;
  idModulos: number[];
  comentario: string | null;
}

export class RolDetail {
  constructor(private readonly props: RolDetailProps) {}

  toPrimitives(): RolDetailProps {
    return {
      ...this.props,
      idModulos: [...this.props.idModulos],
    };
  }
}
