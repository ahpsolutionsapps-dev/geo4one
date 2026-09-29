import {
  MarcaAguaSeguimientoRepository,
  VersionCampanaOption,
} from '../../domain/repositories/marca-agua-seguimiento-repository';

export class GetVersionesCampanaOptionsUseCase {
  constructor(private readonly marcasAguaSeguimiento: MarcaAguaSeguimientoRepository) {}

  async execute(): Promise<VersionCampanaOption[]> {
    return this.marcasAguaSeguimiento.findVersionCampanaOptions();
  }
}
