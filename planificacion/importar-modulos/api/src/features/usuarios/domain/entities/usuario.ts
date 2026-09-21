export interface UsuarioProps {
  idUsuario: number;
  idNegocio: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string | null;
  telefono: string | null;
  idRol: number | null;
  rol: string | null;
  palabraSecreta: string | null;
  habilitado: boolean;
  imagen: string | null;
  verificado: boolean;
  estatus: number | null;
  idioma: string;
  tema: string;
  comentario: string | null;
  fechaCreacion: Date;
  fechaModificacion: Date | null;
  anulado: boolean;
}

export class Usuario {
  constructor(private readonly props: UsuarioProps) {}

  get idUsuario(): number {
    return this.props.idUsuario;
  }

  get anulado(): boolean {
    return this.props.anulado;
  }

  get imagen(): string | null {
    return this.props.imagen;
  }

  toPrimitives(): UsuarioProps {
    return { ...this.props };
  }
}
