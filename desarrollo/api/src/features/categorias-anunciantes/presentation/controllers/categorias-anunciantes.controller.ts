import { Request, Response } from 'express';
import { getAuthUserId } from '../../../../shared/presentation/get-auth-user-id';
import { CreateCategoriaAnuncianteUseCase } from '../../application/use-cases/create-categoria-anunciante.use-case';
import { DeactivateCategoriaAnuncianteUseCase } from '../../application/use-cases/deactivate-categoria-anunciante.use-case';
import { GetCategoriaAnuncianteByIdUseCase } from '../../application/use-cases/get-categoria-anunciante-by-id.use-case';
import { GetCategoriasAnunciantesUseCase } from '../../application/use-cases/get-categorias-anunciantes.use-case';
import { UpdateCategoriaAnuncianteUseCase } from '../../application/use-cases/update-categoria-anunciante.use-case';
import {
  categoriaAnuncianteIdParamsSchema,
  createCategoriaAnuncianteSchema,
  updateCategoriaAnuncianteSchema,
} from '../validators/categorias-anunciantes.schemas';

export class CategoriasAnunciantesController {
  constructor(
    private readonly getCategoriasAnunciantes: GetCategoriasAnunciantesUseCase,
    private readonly getCategoriaAnuncianteById: GetCategoriaAnuncianteByIdUseCase,
    private readonly createCategoriaAnunciante: CreateCategoriaAnuncianteUseCase,
    private readonly updateCategoriaAnunciante: UpdateCategoriaAnuncianteUseCase,
    private readonly deactivateCategoriaAnunciante: DeactivateCategoriaAnuncianteUseCase,
  ) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.getCategoriasAnunciantes.execute();
    res.status(200).json({ items });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const params = categoriaAnuncianteIdParamsSchema.parse(req.params);
    const item = await this.getCategoriaAnuncianteById.execute(params.id);
    res.status(200).json({ item });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const data = createCategoriaAnuncianteSchema.parse(req.body);
    const item = await this.createCategoriaAnunciante.execute({
      idSectorIndustrial: data.idSectorIndustrial,
      idSubSectorIndustrial: data.idSubSectorIndustrial,
      categoriaAnunciante: data.categoriaAnunciante,
      creadoPor: idUsuario,
    });
    res.status(201).json({ item });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = categoriaAnuncianteIdParamsSchema.parse(req.params);
    const data = updateCategoriaAnuncianteSchema.parse(req.body);
    const item = await this.updateCategoriaAnunciante.execute(params.id, {
      idSectorIndustrial: data.idSectorIndustrial,
      idSubSectorIndustrial: data.idSubSectorIndustrial,
      categoriaAnunciante: data.categoriaAnunciante,
      activo: data.activo,
      actualizadoPor: idUsuario,
    });
    res.status(200).json({ item });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = categoriaAnuncianteIdParamsSchema.parse(req.params);
    await this.deactivateCategoriaAnunciante.execute(params.id, idUsuario);
    res.status(204).send();
  };
}