export interface RolProps {
  idRol: number;
  rol: string;
  descripcion: string;
  idUsuarioRegistra: number | null;
  fechaCreacion: Date;
  idUsuarioModifica: number | null;
  fechaModificacion: Date | null;
  anulado: boolean;
  idUsuarioAnula: number | null;
  fechaAnulado: Date | null;
  comentario: string | null;
}

export class Rol {
  constructor(private readonly props: RolProps) {}

  get idRol(): number { return this.props.idRol; }
  get rol(): string { return this.props.rol; }
  get descripcion(): string { return this.props.descripcion; }
  get anulado(): boolean { return this.props.anulado; }
  get fechaCreacion(): Date { return this.props.fechaCreacion; }
  get idUsuarioRegistra(): number | null { return this.props.idUsuarioRegistra; }
  get idUsuarioModifica(): number | null { return this.props.idUsuarioModifica; }
  get fechaModificacion(): Date | null { return this.props.fechaModificacion; }
  get idUsuarioAnula(): number | null { return this.props.idUsuarioAnula; }
  get fechaAnulado(): Date | null { return this.props.fechaAnulado; }
  get comentario(): string | null { return this.props.comentario; }

  toJSON(): RolProps { return { ...this.props }; }
}
