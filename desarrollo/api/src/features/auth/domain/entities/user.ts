export interface UserProps {
  idUsuario: number;
  idNegocio: number;
  username: string;
  email: string;
  userpassword: string;
  nombre: string;
  apellido: string | null;
  telefono: string | null;
  idRol: number | null;
  palabraSecreta: string | null;
  habilitado: boolean;
  imagen: string | null;
  idUsuarioRegistra: number | null;
  fechaCreacion: Date;
  idUsuarioModifica: number | null;
  fechaModificacion: Date | null;
  anulado: boolean;
  idUsuarioAnula: number | null;
  fechaAnulado: Date | null;
  comentario: string | null;
  verificado: boolean;
  estatus: number | null;
  idioma: string;
  tema: string;
  intentosFallidos: number;
  ultimoAcceso: Date | null;
  bloqueadoHasta: Date | null;
}

export type PublicUserProps = Omit<UserProps, 'userpassword' | 'palabraSecreta'>;

export class User {
  constructor(private readonly props: UserProps) {}

  get idUsuario(): number { return this.props.idUsuario; }
  get idNegocio(): number { return this.props.idNegocio; }
  get username(): string { return this.props.username; }
  get email(): string { return this.props.email; }
  get userpassword(): string { return this.props.userpassword; }
  get nombre(): string { return this.props.nombre; }
  get apellido(): string | null { return this.props.apellido; }
  get telefono(): string | null { return this.props.telefono; }
  get idRol(): number | null { return this.props.idRol; }
  get palabraSecreta(): string | null { return this.props.palabraSecreta; }
  get habilitado(): boolean { return this.props.habilitado; }
  get imagen(): string | null { return this.props.imagen; }
  get idUsuarioRegistra(): number | null { return this.props.idUsuarioRegistra; }
  get fechaCreacion(): Date { return this.props.fechaCreacion; }
  get idUsuarioModifica(): number | null { return this.props.idUsuarioModifica; }
  get fechaModificacion(): Date | null { return this.props.fechaModificacion; }
  get anulado(): boolean { return this.props.anulado; }
  get idUsuarioAnula(): number | null { return this.props.idUsuarioAnula; }
  get fechaAnulado(): Date | null { return this.props.fechaAnulado; }
  get comentario(): string | null { return this.props.comentario; }
  get verificado(): boolean { return this.props.verificado; }
  get estatus(): number | null { return this.props.estatus; }
  get idioma(): string { return this.props.idioma; }
  get tema(): string { return this.props.tema; }
  get intentosFallidos(): number { return this.props.intentosFallidos; }
  get ultimoAcceso(): Date | null { return this.props.ultimoAcceso; }
  get bloqueadoHasta(): Date | null { return this.props.bloqueadoHasta; }

  canLogin(): boolean {
    return this.props.habilitado && !this.props.anulado;
  }

  canAccessModules(): boolean {
    return this.canLogin() && this.props.verificado;
  }

  toPublic(): PublicUserProps {
    const { userpassword: _u, palabraSecreta: _p, ...rest } = this.props;
    return rest;
  }
}
