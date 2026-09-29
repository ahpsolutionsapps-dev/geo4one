import { Request, Response } from 'express';
import { getAuthUserId } from '../../../../shared/presentation/get-auth-user-id';
import { CreateSubSectorIndustrialUseCase } from '../../application/use-cases/create-sub-sector-industrial.use-case';
import { DeactivateSubSectorIndustrialUseCase } from '../../application/use-cases/deactivate-sub-sector-industrial.use-case';
import { GetSubSectorIndustrialByIdUseCase } from '../../application/use-cases/get-sub-sector-industrial-by-id.use-case';
import { GetSubSectoresIndustrialesUseCase } from '../../application/use-cases/get-sub-sectores-industriales.use-case';
import { UpdateSubSectorIndustrialUseCase } from '../../application/use-cases/update-sub-sector-industrial.use-case';
import {
  createSubSectorIndustrialSchema,
  subSectorIndustrialIdParamsSchema,
  updateSubSectorIndustrialSchema,
} from '../validators/sub-sectores-industriales.schemas';

export class SubSectoresIndustrialesController {
  constructor(
    private readonly getSubSectoresIndustriales: GetSubSectoresIndustrialesUseCase,
    private readonly getSubSectorIndustrialById: GetSubSectorIndustrialByIdUseCase,
    private readonly createSubSectorIndustrial: CreateSubSectorIndustrialUseCase,
    private readonly updateSubSectorIndustrial: UpdateSubSectorIndustrialUseCase,
    private readonly deactivateSubSectorIndustrial: DeactivateSubSectorIndustrialUseCase,
  ) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.getSubSectoresIndustriales.execute();
    res.status(200).json({ items });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const params = subSectorIndustrialIdParamsSchema.parse(req.params);
    const item = await this.getSubSectorIndustrialById.execute(params.id);
    res.status(200).json({ item });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const data = createSubSectorIndustrialSchema.parse(req.body);
    const item = await this.createSubSectorIndustrial.execute({
      idSectorIndustrial: data.idSectorIndustrial,
      subSectorIndustrial: data.subSectorIndustrial,
      creadoPor: idUsuario,
    });
    res.status(201).json({ item });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = subSectorIndustrialIdParamsSchema.parse(req.params);
    const data = updateSubSectorIndustrialSchema.parse(req.body);
    const item = await this.updateSubSectorIndustrial.execute(params.id, {
      idSectorIndustrial: data.idSectorIndustrial,
      subSectorIndustrial: data.subSectorIndustrial,
      activo: data.activo,
      actualizadoPor: idUsuario,
    });
    res.status(200).json({ item });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = subSectorIndustrialIdParamsSchema.parse(req.params);
    await this.deactivateSubSectorIndustrial.execute(params.id, idUsuario);
    res.status(204).send();
  };
}