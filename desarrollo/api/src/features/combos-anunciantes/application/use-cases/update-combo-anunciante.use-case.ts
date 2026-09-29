import { NotFoundError, ValidationError } from '../../../../core/errors/app-error';
import { ComboAnuncianteProps } from '../../domain/entities/combo-anunciante';
import { ComboAnuncianteRepository, ComboMarcaInput } from '../../domain/repositories/combo-anunciante-repository';

export interface UpdateComboAnuncianteUseCaseInput {
  comboAnunciante?: string;
  marcas?: ComboMarcaInput[];
  activo?: boolean;
  actualizadoPor: number;
}

function validateMarcasInput(marcas: ComboMarcaInput[]) {
  if (marcas.length === 0) {
    throw new ValidationError('Debes seleccionar al menos una marca de producto');
  }

  const seenMarcas = new Set<number>();
  const seenOrden = new Set<number>();

  for (const item of marcas) {
    if (seenMarcas.has(item.idMarcaProducto)) {
      throw new ValidationError('No puedes repetir marcas de producto en el mismo combo');
    }

    if (seenOrden.has(item.orden)) {
      throw new ValidationError('No puedes repetir el orden de marcas en el mismo combo');
    }

    seenMarcas.add(item.idMarcaProducto);
    seenOrden.add(item.orden);
  }
}

export class UpdateComboAnuncianteUseCase {
  constructor(private readonly combosAnunciantes: ComboAnuncianteRepository) {}

  async execute(
    idComboAnunciante: number,
    input: UpdateComboAnuncianteUseCaseInput,
  ): Promise<ComboAnuncianteProps> {
    const existing = await this.combosAnunciantes.findById(idComboAnunciante);
    if (!existing) {
      throw new NotFoundError('Combo de anunciante no encontrado');
    }

    if (input.marcas !== undefined) {
      validateMarcasInput(input.marcas);

      const existingMarcas = await this.combosAnunciantes.findMarcasByIds(
        input.marcas.map((item) => item.idMarcaProducto),
      );

      if (existingMarcas.length !== input.marcas.length) {
        throw new NotFoundError('Una o mas marcas de producto no existen');
      }
    }

    const updated = await this.combosAnunciantes.update(idComboAnunciante, {
      comboAnunciante: input.comboAnunciante?.trim(),
      marcas: input.marcas,
      activo: input.activo,
      actualizadoPor: input.actualizadoPor,
    });

    return updated.toPrimitives();
  }
}
