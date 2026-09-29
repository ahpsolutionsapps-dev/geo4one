import { SectorIndustrialProps } from '../../domain/entities/sector-industrial';
import { SectorIndustrialRepository } from '../../domain/repositories/sector-industrial-repository';

export class GetSectoresIndustrialesUseCase {
  constructor(private readonly sectoresIndustriales: SectorIndustrialRepository) {}

  async execute(): Promise<SectorIndustrialProps[]> {
    const rows = await this.sectoresIndustriales.findMany();
    return rows.map((row) => row.toPrimitives());
  }
}