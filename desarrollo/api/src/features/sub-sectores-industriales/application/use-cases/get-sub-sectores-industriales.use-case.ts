import { SubSectorIndustrialProps } from '../../domain/entities/sub-sector-industrial';
import { SubSectorIndustrialRepository } from '../../domain/repositories/sub-sector-industrial-repository';

export class GetSubSectoresIndustrialesUseCase {
  constructor(private readonly subSectoresIndustriales: SubSectorIndustrialRepository) {}

  async execute(): Promise<SubSectorIndustrialProps[]> {
    const rows = await this.subSectoresIndustriales.findMany();
    return rows.map((row) => row.toPrimitives());
  }
}