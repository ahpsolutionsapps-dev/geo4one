import { ComboAnunciante } from '../entities/combo-anunciante';

export interface ComboMarcaInput {
  idMarcaProducto: number;
  orden: number;
}

export interface CreateComboAnuncianteInput {
  comboAnunciante: string;
  marcas: ComboMarcaInput[];
  creadoPor: number;
}

export interface UpdateComboAnuncianteInput {
  comboAnunciante?: string;
  marcas?: ComboMarcaInput[];
  activo?: boolean;
  actualizadoPor: number;
}

export interface ComboMarcaProductoOption {
  idMarcaProducto: number;
  marcaProducto: string;
  anunciante: string;
}

export interface ComboAnuncianteRepository {
  findMany(): Promise<ComboAnunciante[]>;
  findById(idComboAnunciante: number): Promise<ComboAnunciante | null>;
  findMarcasByIds(idsMarcas: number[]): Promise<number[]>;
  findMarcaProductoOptions(): Promise<ComboMarcaProductoOption[]>;
  create(input: CreateComboAnuncianteInput): Promise<ComboAnunciante>;
  update(idComboAnunciante: number, input: UpdateComboAnuncianteInput): Promise<ComboAnunciante>;
  deactivate(idComboAnunciante: number, actualizadoPor: number): Promise<void>;
}
