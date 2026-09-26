import { SectorProps } from '../../domain/entities/sector';
import { SectorRepository } from '../../domain/repositories/sector-repository';

export class GetSectoresUseCase {
  constructor(private readonly sectores: SectorRepository) {}

  async execute(): Promise<SectorProps[]> {
    const rows = await this.sectores.findMany();
    return rows.map((row) => row.toPrimitives());
  }
}
