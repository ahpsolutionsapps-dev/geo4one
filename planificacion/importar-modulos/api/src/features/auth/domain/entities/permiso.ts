export interface PermisoProps {
  idPermiso: number;
  permiso: string;
  descripcion: string;
  idUsuarioRegistra: number;
  fechaCreacion: Date;
  idUsuarioModifica: number | null;
  fechaModificacion: Date | null;
  anulado: boolean;
  idUsuarioAnula: number | null;
  fechaAnulado: Date | null;
  comentario: string | null;
}

export class Permiso {
  constructor(private readonly props: PermisoProps) {}

  get idPermiso(): number { return this.props.idPermiso; }
  get permiso(): string { return this.props.permiso; }
  get descripcion(): string { return this.props.descripcion; }
  get anulado(): boolean { return this.props.anulado; }
  get fechaCreacion(): Date { return this.props.fechaCreacion; }
  get idUsuarioRegistra(): number { return this.props.idUsuarioRegistra; }
  get idUsuarioModifica(): number | null { return this.props.idUsuarioModifica; }
  get fechaModificacion(): Date | null { return this.props.fechaModificacion; }
  get idUsuarioAnula(): number | null { return this.props.idUsuarioAnula; }
  get fechaAnulado(): Date | null { return this.props.fechaAnulado; }
  get comentario(): string | null { return this.props.comentario; }

  toJSON(): PermisoProps { return { ...this.props }; }
}
