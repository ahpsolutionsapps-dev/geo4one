import { Request, Response } from 'express';
import { getAuthUserId } from '../../../../shared/presentation/get-auth-user-id';
import { CreateComboAnuncianteUseCase } from '../../application/use-cases/create-combo-anunciante.use-case';
import { DeactivateComboAnuncianteUseCase } from '../../application/use-cases/deactivate-combo-anunciante.use-case';
import { GetComboAnuncianteByIdUseCase } from '../../application/use-cases/get-combo-anunciante-by-id.use-case';
import { GetComboMarcasOptionsUseCase } from '../../application/use-cases/get-combo-marcas-options.use-case';
import { GetCombosAnunciantesUseCase } from '../../application/use-cases/get-combos-anunciantes.use-case';
import { UpdateComboAnuncianteUseCase } from '../../application/use-cases/update-combo-anunciante.use-case';
import {
  comboAnuncianteIdParamsSchema,
  createComboAnuncianteSchema,
  updateComboAnuncianteSchema,
} from '../validators/combos-anunciantes.schemas';

export class CombosAnunciantesController {
  constructor(
    private readonly getCombosAnunciantes: GetCombosAnunciantesUseCase,
    private readonly getComboAnuncianteById: GetComboAnuncianteByIdUseCase,
    private readonly getComboMarcasOptions: GetComboMarcasOptionsUseCase,
    private readonly createComboAnunciante: CreateComboAnuncianteUseCase,
    private readonly updateComboAnunciante: UpdateComboAnuncianteUseCase,
    private readonly deactivateComboAnunciante: DeactivateComboAnuncianteUseCase,
  ) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.getCombosAnunciantes.execute();
    res.status(200).json({ items });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const params = comboAnuncianteIdParamsSchema.parse(req.params);
    const item = await this.getComboAnuncianteById.execute(params.id);
    res.status(200).json({ item });
  };

  listMarcasOptions = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.getComboMarcasOptions.execute();
    res.status(200).json({ items });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const data = createComboAnuncianteSchema.parse(req.body);
    const item = await this.createComboAnunciante.execute({
      comboAnunciante: data.comboAnunciante,
      marcas: data.marcas,
      creadoPor: idUsuario,
    });
    res.status(201).json({ item });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = comboAnuncianteIdParamsSchema.parse(req.params);
    const data = updateComboAnuncianteSchema.parse(req.body);
    const item = await this.updateComboAnunciante.execute(params.id, {
      comboAnunciante: data.comboAnunciante,
      marcas: data.marcas,
      activo: data.activo,
      actualizadoPor: idUsuario,
    });
    res.status(200).json({ item });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = comboAnuncianteIdParamsSchema.parse(req.params);
    await this.deactivateComboAnunciante.execute(params.id, idUsuario);
    res.status(204).send();
  };
}
