export interface ModuloProps {
  idModulo: number;
  codigo: string | null;
  nombreModulo: string;
  icono: string | null;
  ruta: string | null;
  idPadre: number | null;
  orderIndex: number;
  oculto: boolean;
}

export class Modulo {
  constructor(private readonly props: ModuloProps) {}

  get idModulo(): number {
    return this.props.idModulo;
  }

  get codigo(): string | null {
    return this.props.codigo;
  }

  get nombreModulo(): string {
    return this.props.nombreModulo;
  }

  get icono(): string | null {
    return this.props.icono;
  }

  get ruta(): string | null {
    return this.props.ruta;
  }

  get idPadre(): number | null {
    return this.props.idPadre;
  }

  get orderIndex(): number {
    return this.props.orderIndex;
  }

  get oculto(): boolean {
    return this.props.oculto;
  }

  toJSON(): ModuloProps {
    return { ...this.props };
  }
}
