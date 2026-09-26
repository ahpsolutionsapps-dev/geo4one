import { ProvinciaProps } from '../../domain/entities/provincia';
import { ProvinciaRepository } from '../../domain/repositories/provincia-repository';

export class GetProvinciasUseCase {
  constructor(private readonly provincias: ProvinciaRepository) {}

  async execute(): Promise<ProvinciaProps[]> {
    const rows = await this.provincias.findMany();
    return rows.map((row) => row.toPrimitives());
  }
}
