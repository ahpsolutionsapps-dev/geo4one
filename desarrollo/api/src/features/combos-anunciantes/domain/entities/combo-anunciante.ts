export interface ComboAnuncianteMarcaProps {
  idMarcaProducto: number;
  marcaProducto: string;
  anunciante: string;
  orden: number;
}

export interface ComboAnuncianteProps {
  idComboAnunciante: number;
  comboAnunciante: string;
  marcas: ComboAnuncianteMarcaProps[];
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export class ComboAnunciante {
  constructor(private readonly props: ComboAnuncianteProps) {}

  toPrimitives(): ComboAnuncianteProps {
    return { ...this.props, marcas: [...this.props.marcas] };
  }
}
