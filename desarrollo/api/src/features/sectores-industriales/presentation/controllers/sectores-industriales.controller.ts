import { Request, Response } from 'express';
import { getAuthUserId } from '../../../../shared/presentation/get-auth-user-id';
import { CreateSectorIndustrialUseCase } from '../../application/use-cases/create-sector-industrial.use-case';
import { DeactivateSectorIndustrialUseCase } from '../../application/use-cases/deactivate-sector-industrial.use-case';
import { GetSectorIndustrialByIdUseCase } from '../../application/use-cases/get-sector-industrial-by-id.use-case';
import { GetSectoresIndustrialesUseCase } from '../../application/use-cases/get-sectores-industriales.use-case';
import { UpdateSectorIndustrialUseCase } from '../../application/use-cases/update-sector-industrial.use-case';
import {
  createSectorIndustrialSchema,
  sectorIndustrialIdParamsSchema,
  updateSectorIndustrialSchema,
} from '../validators/sectores-industriales.schemas';

export class SectoresIndustrialesController {
  constructor(
    private readonly getSectoresIndustriales: GetSectoresIndustrialesUseCase,
    private readonly getSectorIndustrialById: GetSectorIndustrialByIdUseCase,
    private readonly createSectorIndustrial: CreateSectorIndustrialUseCase,
    private readonly updateSectorIndustrial: UpdateSectorIndustrialUseCase,
    private readonly deactivateSectorIndustrial: DeactivateSectorIndustrialUseCase,
  ) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.getSectoresIndustriales.execute();
    res.status(200).json({ items });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const params = sectorIndustrialIdParamsSchema.parse(req.params);
    const item = await this.getSectorIndustrialById.execute(params.id);
    res.status(200).json({ item });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const data = createSectorIndustrialSchema.parse(req.body);
    const item = await this.createSectorIndustrial.execute({
      sectorIndustrial: data.sectorIndustrial,
      creadoPor: idUsuario,
    });
    res.status(201).json({ item });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = sectorIndustrialIdParamsSchema.parse(req.params);
    const data = updateSectorIndustrialSchema.parse(req.body);
    const item = await this.updateSectorIndustrial.execute(params.id, {
      sectorIndustrial: data.sectorIndustrial,
      activo: data.activo,
      actualizadoPor: idUsuario,
    });
    res.status(200).json({ item });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = sectorIndustrialIdParamsSchema.parse(req.params);
    await this.deactivateSectorIndustrial.execute(params.id, idUsuario);
    res.status(204).send();
  };
}