import { Proveedor } from '../entities/proveedor';

export interface CreateProveedorInput {
  proveedor: string;
  rnc?: string | null;
  personaContacto?: string | null;
  cargo?: string | null;
  email?: string | null;
  paginaWeb?: string | null;
  direccion?: string | null;
  idProvincia?: number | null;
  idMunicipio?: number | null;
  idSectorBarrio?: number | null;
  creadoPor: number;
}

export interface UpdateProveedorInput {
  proveedor?: string;
  rnc?: string | null;
  personaContacto?: string | null;
  cargo?: string | null;
  email?: string | null;
  paginaWeb?: string | null;
  direccion?: string | null;
  idProvincia?: number | null;
  idMunicipio?: number | null;
  idSectorBarrio?: number | null;
  activo?: boolean;
  actualizadoPor: number;
}

export interface ProveedorRepository {
  findMany(): Promise<Proveedor[]>;
  findById(idProveedor: number): Promise<Proveedor | null>;
  findByRnc(rnc: string): Promise<Proveedor | null>;
  create(input: CreateProveedorInput): Promise<Proveedor>;
  update(idProveedor: number, input: UpdateProveedorInput): Promise<Proveedor>;
  deactivate(idProveedor: number, actualizadoPor: number): Promise<void>;

  findTelefonos(idProveedor: number): Promise<ProveedorTelefono[]>;
  findTelefonoById(idProveedorTelefono: number): Promise<ProveedorTelefono | null>;
  createTelefono(input: CreateProveedorTelefonoInput): Promise<ProveedorTelefono>;
  updateTelefono(
    idProveedorTelefono: number,
    input: UpdateProveedorTelefonoInput,
  ): Promise<ProveedorTelefono>;
  deactivateTelefono(idProveedorTelefono: number, actualizadoPor: number): Promise<void>;
}

export interface ProveedorTelefono {
  idProveedorTelefono: number;
  idProveedor: number;
  telefono: string;
  tipo: string | null;
  principal: boolean;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export interface CreateProveedorTelefonoInput {
  idProveedor: number;
  telefono: string;
  tipo?: string | null;
  principal?: boolean;
  creadoPor: number;
}

export interface UpdateProveedorTelefonoInput {
  telefono?: string;
  tipo?: string | null;
  principal?: boolean;
  activo?: boolean;
  actualizadoPor: number;
}
