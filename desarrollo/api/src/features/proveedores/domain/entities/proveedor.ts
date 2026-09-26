export interface ProveedorProps {
  idProveedor: number;
  proveedor: string;
  rnc: string | null;
  personaContacto: string | null;
  cargo: string | null;
  email: string | null;
  paginaWeb: string | null;
  direccion: string | null;
  idProvincia: number | null;
  idMunicipio: number | null;
  idSectorBarrio: number | null;
  provinciaNombre: string | null;
  municipioNombre: string | null;
  sectorBarrioNombre: string | null;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export class Proveedor {
  constructor(private readonly props: ProveedorProps) {}

  toPrimitives(): ProveedorProps {
    return { ...this.props };
  }
}
