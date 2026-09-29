import { ConflictError, NotFoundError, ValidationError } from '../../../../core/errors/app-error';
import { MarcaProductoProps } from '../../domain/entities/marca-producto';
import { MarcaProductoRepository } from '../../domain/repositories/marca-producto-repository';

export interface UpdateMarcaProductoUseCaseInput {
  idAnunciante?: number;
  idCategoriaAnunciante?: number;
  marcaProducto?: string;
  activo?: boolean;
  actualizadoPor: number;
}

export class UpdateMarcaProductoUseCase {
  constructor(private readonly marcasProductos: MarcaProductoRepository) {}

  async execute(idMarcaProducto: number, input: UpdateMarcaProductoUseCaseInput): Promise<MarcaProductoProps> {
    const existing = await this.marcasProductos.findById(idMarcaProducto);
    if (!existing) {
      throw new NotFoundError('Marca / producto no encontrado');
    }

    const existingData = existing.toPrimitives();
    const nextAnunciante = input.idAnunciante ?? existingData.idAnunciante;
    const nextCategoria = input.idCategoriaAnunciante ?? existingData.idCategoriaAnunciante;
    const nextMarcaProducto = input.marcaProducto?.trim() ?? existingData.marcaProducto;

    const anunciante = await this.marcasProductos.findAnuncianteById(nextAnunciante);
    if (!anunciante) {
      throw new NotFoundError('Anunciante no encontrado');
    }

    const categoria = await this.marcasProductos.findCategoriaById(nextCategoria);
    if (!categoria) {
      throw new NotFoundError('Categoría de anunciante no encontrada');
    }

    if (anunciante.idCategoriaAnunciante !== nextCategoria) {
      throw new ValidationError('La categoría seleccionada no corresponde al anunciante');
    }

    const existingByName = await this.marcasProductos.findByNombreInAnunciante(nextAnunciante, nextMarcaProducto);
    if (existingByName && existingByName.toPrimitives().idMarcaProducto !== idMarcaProducto) {
      throw new ConflictError('Ya existe una marca / producto con ese nombre para ese anunciante');
    }

    const updated = await this.marcasProductos.update(idMarcaProducto, {
      idAnunciante: input.idAnunciante,
      idCategoriaAnunciante: input.idCategoriaAnunciante,
      marcaProducto: input.marcaProducto?.trim(),
      activo: input.activo,
      actualizadoPor: input.actualizadoPor,
    });

    return updated.toPrimitives();
  }
}