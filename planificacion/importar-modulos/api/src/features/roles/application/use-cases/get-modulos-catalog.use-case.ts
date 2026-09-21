import { Modulo } from '../../../auth/domain/entities/modulo';
import { ModuloRepository } from '../../../auth/domain/repositories/modulo-repository';

export interface ModuloCatalogItem {
  idModulo: number;
  codigo: string | null;
  nombreModulo: string;
  icono: string | null;
  ruta: string | null;
  idPadre: number | null;
  orderIndex: number;
  oculto: boolean;
}

export class GetModulosCatalogUseCase {
  constructor(private readonly modulos: ModuloRepository) {}

  async execute(options?: {
    includeHidden?: boolean;
  }): Promise<ModuloCatalogItem[]> {
    const includeHidden = options?.includeHidden === true;
    const rows = await this.modulos.findAll({ includeHidden });
    return rows.map((modulo: Modulo) => ({
      idModulo: modulo.idModulo,
      codigo: modulo.codigo,
      nombreModulo: modulo.nombreModulo,
      icono: modulo.icono,
      ruta: modulo.ruta,
      idPadre: modulo.idPadre,
      orderIndex: modulo.orderIndex,
      oculto: modulo.oculto,
    }));
  }
}
