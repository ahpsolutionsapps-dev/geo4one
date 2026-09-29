import { NotFoundError, ValidationError } from '../../../../core/errors/app-error';
import { ComboAnuncianteProps } from '../../domain/entities/combo-anunciante';
import { ComboAnuncianteRepository, ComboMarcaInput } from '../../domain/repositories/combo-anunciante-repository';

export interface CreateComboAnuncianteUseCaseInput {
  comboAnunciante: string;
  marcas: ComboMarcaInput[];
  creadoPor: number;
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

export class CreateComboAnuncianteUseCase {
  constructor(private readonly combosAnunciantes: ComboAnuncianteRepository) {}

  async execute(input: CreateComboAnuncianteUseCaseInput): Promise<ComboAnuncianteProps> {
    const comboAnunciante = input.comboAnunciante.trim();
    validateMarcasInput(input.marcas);

    const existingMarcas = await this.combosAnunciantes.findMarcasByIds(
      input.marcas.map((item) => item.idMarcaProducto),
    );

    if (existingMarcas.length !== input.marcas.length) {
      throw new NotFoundError('Una o mas marcas de producto no existen');
    }

    const created = await this.combosAnunciantes.create({
      comboAnunciante,
      marcas: input.marcas,
      creadoPor: input.creadoPor,
    });

    return created.toPrimitives();
  }
}
