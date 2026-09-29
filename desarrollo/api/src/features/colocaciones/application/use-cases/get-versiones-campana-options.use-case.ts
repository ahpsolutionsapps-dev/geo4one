import {
  ColocacionRepository,
  VersionCampanaOption,
} from '../../domain/repositories/colocacion-repository';

export class GetVersionesCampanaOptionsUseCase {
  constructor(private readonly colocaciones: ColocacionRepository) {}

  async execute(): Promise<VersionCampanaOption[]> {
    return this.colocaciones.findVersionesCampanaOptions();
  }
}
