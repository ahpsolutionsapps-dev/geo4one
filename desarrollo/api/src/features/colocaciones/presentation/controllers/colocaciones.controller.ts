import { Request, Response } from 'express';
import { getAuthUserId } from '../../../../shared/presentation/get-auth-user-id';
import { CreateColocacionUseCase } from '../../application/use-cases/create-colocacion.use-case';
import { DeactivateColocacionUseCase } from '../../application/use-cases/deactivate-colocacion.use-case';
import { GetColocacionByIdUseCase } from '../../application/use-cases/get-colocacion-by-id.use-case';
import { GetColocacionesUseCase } from '../../application/use-cases/get-colocaciones.use-case';
import { GetElementosOptionsUseCase } from '../../application/use-cases/get-elementos-options.use-case';
import { GetPeriodosOptionsUseCase } from '../../application/use-cases/get-periodos-options.use-case';
import { GetVersionesCampanaOptionsUseCase } from '../../application/use-cases/get-versiones-campana-options.use-case';
import { UpdateColocacionUseCase } from '../../application/use-cases/update-colocacion.use-case';
import {
  colocacionIdParamsSchema,
  createColocacionSchema,
  updateColocacionSchema,
} from '../validators/colocaciones.schemas';

export class ColocacionesController {
  constructor(
    private readonly getColocaciones: GetColocacionesUseCase,
    private readonly getColocacionById: GetColocacionByIdUseCase,
    private readonly getElementosOptions: GetElementosOptionsUseCase,
    private readonly getVersionesCampanaOptions: GetVersionesCampanaOptionsUseCase,
    private readonly getPeriodosOptions: GetPeriodosOptionsUseCase,
    private readonly createColocacion: CreateColocacionUseCase,
    private readonly updateColocacion: UpdateColocacionUseCase,
    private readonly deactivateColocacion: DeactivateColocacionUseCase,
  ) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.getColocaciones.execute();
    res.status(200).json({ items });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const params = colocacionIdParamsSchema.parse(req.params);
    const item = await this.getColocacionById.execute(params.id);
    res.status(200).json({ item });
  };

  listElementosOptions = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.getElementosOptions.execute();
    res.status(200).json({ items });
  };

  listVersionesCampanaOptions = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.getVersionesCampanaOptions.execute();
    res.status(200).json({ items });
  };

  listPeriodosOptions = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.getPeriodosOptions.execute();
    res.status(200).json({ items });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const data = createColocacionSchema.parse(req.body);
    const item = await this.createColocacion.execute({
      codigoSeguimiento: data.codigoSeguimiento,
      idElemento: data.idElemento,
      idVersionCampana: data.idVersionCampana,
      idPeriodoColocacion: data.idPeriodoColocacion,
      observaciones: data.observaciones,
      creadoPor: idUsuario,
    });
    res.status(201).json({ item });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = colocacionIdParamsSchema.parse(req.params);
    const data = updateColocacionSchema.parse(req.body);
    const item = await this.updateColocacion.execute(params.id, {
      codigoSeguimiento: data.codigoSeguimiento,
      idElemento: data.idElemento,
      idVersionCampana: data.idVersionCampana,
      idPeriodoColocacion: data.idPeriodoColocacion,
      observaciones: data.observaciones,
      activo: data.activo,
      actualizadoPor: idUsuario,
    });
    res.status(200).json({ item });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = colocacionIdParamsSchema.parse(req.params);
    await this.deactivateColocacion.execute(params.id, idUsuario);
    res.status(204).send();
  };
}
