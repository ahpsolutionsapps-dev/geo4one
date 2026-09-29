import { NotFoundError, ValidationError } from '../../../../core/errors/app-error';
import { ColocacionProps } from '../../domain/entities/colocacion';
import { ColocacionRepository } from '../../domain/repositories/colocacion-repository';

export interface CreateColocacionUseCaseInput {
  codigoSeguimiento: string;
  idElemento: number;
  idVersionCampana: number;
  idPeriodoColocacion: number;
  observaciones?: string | null;
  creadoPor: number;
}

export class CreateColocacionUseCase {
  constructor(private readonly colocaciones: ColocacionRepository) {}

  async execute(input: CreateColocacionUseCaseInput): Promise<ColocacionProps> {
    const existing = await this.colocaciones.findByCodigoSeguimiento(input.codigoSeguimiento);
    if (existing) {
      throw new ValidationError('Ya existe una colocacion con ese codigo de seguimiento');
    }

    const elemento = await this.colocaciones.findElementoById(input.idElemento);
    if (!elemento) {
      throw new NotFoundError('Elemento no encontrado');
    }

    if (!elemento.activo || elemento.anulado) {
      throw new ValidationError('El elemento no esta disponible para colocaciones');
    }

    const version = await this.colocaciones.findVersionCampanaById(input.idVersionCampana);
    if (!version) {
      throw new NotFoundError('Version de campana no encontrada');
    }

    if (!version.activo || version.anulado) {
      throw new ValidationError('La version de campana no esta disponible');
    }

    const periodo = await this.colocaciones.findPeriodoById(input.idPeriodoColocacion);
    if (!periodo) {
      throw new NotFoundError('Periodo de colocacion no encontrado');
    }

    if (!periodo.activo) {
      throw new ValidationError('El periodo de colocacion no esta activo');
    }

    const created = await this.colocaciones.create({
      codigoSeguimiento: input.codigoSeguimiento,
      idElemento: input.idElemento,
      idVersionCampana: input.idVersionCampana,
      idPeriodoColocacion: input.idPeriodoColocacion,
      observaciones: input.observaciones,
      creadoPor: input.creadoPor,
    });

    return created.toPrimitives();
  }
}
