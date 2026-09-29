import { MarcaProducto } from '../entities/marca-producto';

export interface CreateMarcaProductoInput {
  idAnunciante: number;
  idCategoriaAnunciante: number;
  marcaProducto: string;
  creadoPor: number;
}

export interface UpdateMarcaProductoInput {
  idAnunciante?: number;
  idCategoriaAnunciante?: number;
  marcaProducto?: string;
  activo?: boolean;
  actualizadoPor: number;
}

export interface MarcaProductoRepository {
  findMany(): Promise<MarcaProducto[]>;
  findById(idMarcaProducto: number): Promise<MarcaProducto | null>;
  findByNombreInAnunciante(idAnunciante: number, marcaProducto: string): Promise<MarcaProducto | null>;
  findAnuncianteById(idAnunciante: number): Promise<{ idAnunciante: number; idCategoriaAnunciante: number; anunciante: string } | null>;
  findCategoriaById(idCategoriaAnunciante: number): Promise<{ idCategoriaAnunciante: number; categoriaAnunciante: string } | null>;
  create(input: CreateMarcaProductoInput): Promise<MarcaProducto>;
  update(idMarcaProducto: number, input: UpdateMarcaProductoInput): Promise<MarcaProducto>;
  deactivate(idMarcaProducto: number, actualizadoPor: number): Promise<void>;
}