import { ConflictError } from '../../../../core/errors/app-error';
import { ProvinciaProps } from '../../domain/entities/provincia';
import { ProvinciaRepository } from '../../domain/repositories/provincia-repository';

export interface CreateProvinciaUseCaseInput {
  provincia: string;
  latitud?: number | null;
  longitud?: number | null;
  creadoPor: number;
}

export class CreateProvinciaUseCase {
  constructor(private readonly provincias: ProvinciaRepository) {}

  async execute(input: CreateProvinciaUseCaseInput): Promise<ProvinciaProps> {
    const provincia = input.provincia.trim();
    const existing = await this.provincias.findByNombre(provincia);

    if (existing) {
      throw new ConflictError('Ya existe una provincia con ese nombre');
    }

    const created = await this.provincias.create({
      provincia,
      latitud: input.latitud ?? null,
      longitud: input.longitud ?? null,
      creadoPor: input.creadoPor,
    });

    return created.toPrimitives();
  }
}
