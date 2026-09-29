import { Request, Response } from 'express';
import { getAuthUserId } from '../../../../shared/presentation/get-auth-user-id';
import { CreateAnuncianteUseCase } from '../../application/use-cases/create-anunciante.use-case';
import { DeactivateAnuncianteUseCase } from '../../application/use-cases/deactivate-anunciante.use-case';
import { GetAnuncianteByIdUseCase } from '../../application/use-cases/get-anunciante-by-id.use-case';
import { GetAnunciantesUseCase } from '../../application/use-cases/get-anunciantes.use-case';
import { GetCategoriasAnunciantesOptionsUseCase } from '../../application/use-cases/get-categorias-anunciantes-options.use-case';
import { GetSectoresIndustrialesOptionsUseCase } from '../../application/use-cases/get-sectores-industriales-options.use-case';
import { GetSubSectoresIndustrialesOptionsUseCase } from '../../application/use-cases/get-sub-sectores-industriales-options.use-case';
import { UpdateAnuncianteUseCase } from '../../application/use-cases/update-anunciante.use-case';
import {
  anuncianteIdParamsSchema,
  categoriasOptionsQuerySchema,
  createAnuncianteSchema,
  subSectoresOptionsQuerySchema,
  updateAnuncianteSchema,
} from '../validators/anunciantes.schemas';

export class AnunciantesController {
  constructor(
    private readonly getAnunciantes: GetAnunciantesUseCase,
    private readonly getAnuncianteById: GetAnuncianteByIdUseCase,
    private readonly getSectoresOptions: GetSectoresIndustrialesOptionsUseCase,
    private readonly getSubSectoresOptions: GetSubSectoresIndustrialesOptionsUseCase,
    private readonly getCategoriasOptions: GetCategoriasAnunciantesOptionsUseCase,
    private readonly createAnunciante: CreateAnuncianteUseCase,
    private readonly updateAnunciante: UpdateAnuncianteUseCase,
    private readonly deactivateAnunciante: DeactivateAnuncianteUseCase,
  ) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.getAnunciantes.execute();
    res.status(200).json({ items });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const params = anuncianteIdParamsSchema.parse(req.params);
    const item = await this.getAnuncianteById.execute(params.id);
    res.status(200).json({ item });
  };

  listSectoresOptions = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.getSectoresOptions.execute();
    res.status(200).json({ items });
  };

  listSubSectoresOptions = async (req: Request, res: Response): Promise<void> => {
    const query = subSectoresOptionsQuerySchema.parse(req.query);
    const items = await this.getSubSectoresOptions.execute(query.idSectorIndustrial);
    res.status(200).json({ items });
  };

  listCategoriasOptions = async (req: Request, res: Response): Promise<void> => {
    const query = categoriasOptionsQuerySchema.parse(req.query);
    const items = await this.getCategoriasOptions.execute(query.idSubSectorIndustrial);
    res.status(200).json({ items });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const data = createAnuncianteSchema.parse(req.body);
    const item = await this.createAnunciante.execute({
      idSectorIndustrial: data.idSectorIndustrial,
      idSubSectorIndustrial: data.idSubSectorIndustrial,
      idCategoriaAnunciante: data.idCategoriaAnunciante,
      anunciante: data.anunciante,
      creadoPor: idUsuario,
    });
    res.status(201).json({ item });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = anuncianteIdParamsSchema.parse(req.params);
    const data = updateAnuncianteSchema.parse(req.body);
    const item = await this.updateAnunciante.execute(params.id, {
      idSectorIndustrial: data.idSectorIndustrial,
      idSubSectorIndustrial: data.idSubSectorIndustrial,
      idCategoriaAnunciante: data.idCategoriaAnunciante,
      anunciante: data.anunciante,
      activo: data.activo,
      actualizadoPor: idUsuario,
    });
    res.status(200).json({ item });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = anuncianteIdParamsSchema.parse(req.params);
    await this.deactivateAnunciante.execute(params.id, idUsuario);
    res.status(204).send();
  };
}
