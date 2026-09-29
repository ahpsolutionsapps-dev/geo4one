import { Request, Response } from 'express';
import { getAuthUserId } from '../../../../shared/presentation/get-auth-user-id';
import { CreatePeriodoColocacionUseCase } from '../../application/use-cases/create-periodo-colocacion.use-case';
import { DeactivatePeriodoColocacionUseCase } from '../../application/use-cases/deactivate-periodo-colocacion.use-case';
import { GetPeriodoColocacionByIdUseCase } from '../../application/use-cases/get-periodo-colocacion-by-id.use-case';
import { GetPeriodosColocacionUseCase } from '../../application/use-cases/get-periodos-colocacion.use-case';
import { UpdatePeriodoColocacionUseCase } from '../../application/use-cases/update-periodo-colocacion.use-case';
import {
  createPeriodoColocacionSchema,
  periodoColocacionIdParamsSchema,
  updatePeriodoColocacionSchema,
} from '../validators/periodos-colocacion.schemas';

export class PeriodosColocacionController {
  constructor(
    private readonly getPeriodosColocacion: GetPeriodosColocacionUseCase,
    private readonly getPeriodoColocacionById: GetPeriodoColocacionByIdUseCase,
    private readonly createPeriodoColocacion: CreatePeriodoColocacionUseCase,
    private readonly updatePeriodoColocacion: UpdatePeriodoColocacionUseCase,
    private readonly deactivatePeriodoColocacion: DeactivatePeriodoColocacionUseCase,
  ) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.getPeriodosColocacion.execute();
    res.status(200).json({ items });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const params = periodoColocacionIdParamsSchema.parse(req.params);
    const item = await this.getPeriodoColocacionById.execute(params.id);
    res.status(200).json({ item });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const data = createPeriodoColocacionSchema.parse(req.body);
    const item = await this.createPeriodoColocacion.execute({
      fechaInicial: data.fechaInicial,
      fechaFinal: data.fechaFinal,
      generalesSeguimiento: data.generalesSeguimiento,
      creadoPor: idUsuario,
    });
    res.status(201).json({ item });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = periodoColocacionIdParamsSchema.parse(req.params);
    const data = updatePeriodoColocacionSchema.parse(req.body);
    const item = await this.updatePeriodoColocacion.execute(params.id, {
      fechaInicial: data.fechaInicial,
      fechaFinal: data.fechaFinal,
      generalesSeguimiento: data.generalesSeguimiento,
      activo: data.activo,
      actualizadoPor: idUsuario,
    });
    res.status(200).json({ item });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = periodoColocacionIdParamsSchema.parse(req.params);
    await this.deactivatePeriodoColocacion.execute(params.id, idUsuario);
    res.status(204).send();
  };
}
