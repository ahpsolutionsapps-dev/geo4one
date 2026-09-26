export interface Proveedor {
  id: string;
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
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface ProveedorFormValues {
  proveedor: string;
  rnc: string;
  personaContacto: string;
  cargo: string;
  email: string;
  paginaWeb: string;
  direccion: string;
  idProvincia: string;
  idMunicipio: string;
  idSectorBarrio: string;
  activo: boolean;
}

export interface ProveedorTelefono {
  idProveedorTelefono: number;
  idProveedor: number;
  telefono: string;
  tipo: string | null;
  principal: boolean;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface ProveedorTelefonoFormValues {
  telefono: string;
  tipo: string;
  principal: boolean;
}
