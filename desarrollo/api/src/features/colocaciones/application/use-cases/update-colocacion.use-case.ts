import { NotFoundError, ValidationError } from '../../../../core/errors/app-error';
import { ColocacionProps } from '../../domain/entities/colocacion';
import { ColocacionRepository } from '../../domain/repositories/colocacion-repository';

export interface UpdateColocacionUseCaseInput {
  codigoSeguimiento?: string;
  idElemento?: number;
  idVersionCampana?: number;
  idPeriodoColocacion?: number;
  observaciones?: string | null;
  activo?: boolean;
  actualizadoPor: number;
}

export class UpdateColocacionUseCase {
  constructor(private readonly colocaciones: ColocacionRepository) {}

  async execute(idColocacion: number, input: UpdateColocacionUseCaseInput): Promise<ColocacionProps> {
    const existing = await this.colocaciones.findById(idColocacion);
    if (!existing) {
      throw new NotFoundError('Colocacion no encontrada');
    }

    const current = existing.toPrimitives();
    const nextCodigo = input.codigoSeguimiento ?? current.codigoSeguimiento;
    const nextElemento = input.idElemento ?? current.idElemento;
    const nextVersion = input.idVersionCampana ?? current.idVersionCampana;
    const nextPeriodo = input.idPeriodoColocacion ?? current.idPeriodoColocacion;

    const duplicated = await this.colocaciones.findByCodigoSeguimiento(nextCodigo);
    if (duplicated && duplicated.toPrimitives().idColocacion !== idColocacion) {
      throw new ValidationError('Ya existe una colocacion con ese codigo de seguimiento');
    }

    const elemento = await this.colocaciones.findElementoById(nextElemento);
    if (!elemento) {
      throw new NotFoundError('Elemento no encontrado');
    }

    if (!elemento.activo || elemento.anulado) {
      throw new ValidationError('El elemento no esta disponible para colocaciones');
    }

    const version = await this.colocaciones.findVersionCampanaById(nextVersion);
    if (!version) {
      throw new NotFoundError('Version de campana no encontrada');
    }

    if (!version.activo || version.anulado) {
      throw new ValidationError('La version de campana no esta disponible');
    }

    const periodo = await this.colocaciones.findPeriodoById(nextPeriodo);
    if (!periodo) {
      throw new NotFoundError('Periodo de colocacion no encontrado');
    }

    if (!periodo.activo) {
      throw new ValidationError('El periodo de colocacion no esta activo');
    }

    const updated = await this.colocaciones.update(idColocacion, {
      codigoSeguimiento: input.codigoSeguimiento,
      idElemento: input.idElemento,
      idVersionCampana: input.idVersionCampana,
      idPeriodoColocacion: input.idPeriodoColocacion,
      observaciones: input.observaciones,
      activo: input.activo,
      actualizadoPor: input.actualizadoPor,
    });

    return updated.toPrimitives();
  }
}
