import { ConflictError, NotFoundError, ValidationError } from '../../../../core/errors/app-error';
import { MarcaProductoProps } from '../../domain/entities/marca-producto';
import { MarcaProductoRepository } from '../../domain/repositories/marca-producto-repository';

export interface CreateMarcaProductoUseCaseInput {
  idAnunciante: number;
  idCategoriaAnunciante: number;
  marcaProducto: string;
  creadoPor: number;
}

export class CreateMarcaProductoUseCase {
  constructor(private readonly marcasProductos: MarcaProductoRepository) {}

  async execute(input: CreateMarcaProductoUseCaseInput): Promise<MarcaProductoProps> {
    const marcaProducto = input.marcaProducto.trim();

    const anunciante = await this.marcasProductos.findAnuncianteById(input.idAnunciante);
    if (!anunciante) {
      throw new NotFoundError('Anunciante no encontrado');
    }

    const categoria = await this.marcasProductos.findCategoriaById(input.idCategoriaAnunciante);
    if (!categoria) {
      throw new NotFoundError('Categoría de anunciante no encontrada');
    }

    if (anunciante.idCategoriaAnunciante !== input.idCategoriaAnunciante) {
      throw new ValidationError('La categoría seleccionada no corresponde al anunciante');
    }

    const existing = await this.marcasProductos.findByNombreInAnunciante(input.idAnunciante, marcaProducto);
    if (existing) {
      throw new ConflictError('Ya existe una marca / producto con ese nombre para ese anunciante');
    }

    const created = await this.marcasProductos.create({
      idAnunciante: input.idAnunciante,
      idCategoriaAnunciante: input.idCategoriaAnunciante,
      marcaProducto,
      creadoPor: input.creadoPor,
    });

    return created.toPrimitives();
  }
}