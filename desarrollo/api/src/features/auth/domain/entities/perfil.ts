export interface PerfilProps {
  idPerfil: number;
  idUsuario: number;
  perfil: string;
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

export class Perfil {
  constructor(private readonly props: PerfilProps) {}

  get idPerfil(): number { return this.props.idPerfil; }
  get idUsuario(): number { return this.props.idUsuario; }
  get perfil(): string { return this.props.perfil; }
  get descripcion(): string { return this.props.descripcion; }
  get anulado(): boolean { return this.props.anulado; }
  get fechaCreacion(): Date { return this.props.fechaCreacion; }
  get idUsuarioRegistra(): number { return this.props.idUsuarioRegistra; }
  get idUsuarioModifica(): number | null { return this.props.idUsuarioModifica; }
  get fechaModificacion(): Date | null { return this.props.fechaModificacion; }
  get idUsuarioAnula(): number | null { return this.props.idUsuarioAnula; }
  get fechaAnulado(): Date | null { return this.props.fechaAnulado; }
  get comentario(): string | null { return this.props.comentario; }

  toJSON(): PerfilProps { return { ...this.props }; }
}
