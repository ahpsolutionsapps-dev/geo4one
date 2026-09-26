import { Request, Response } from 'express';
import { getAuthUserId } from '../../../../shared/presentation/get-auth-user-id';
import { CreateSectorUseCase } from '../../application/use-cases/create-sector.use-case';
import { DeactivateSectorUseCase } from '../../application/use-cases/deactivate-sector.use-case';
import { GetSectorByIdUseCase } from '../../application/use-cases/get-sector-by-id.use-case';
import { GetSectoresUseCase } from '../../application/use-cases/get-sectores.use-case';
import { UpdateSectorUseCase } from '../../application/use-cases/update-sector.use-case';
import {
  createSectorSchema,
  sectorIdParamsSchema,
  updateSectorSchema,
} from '../validators/sectores.schemas';

export class SectoresController {
  constructor(
    private readonly getSectores: GetSectoresUseCase,
    private readonly getSectorById: GetSectorByIdUseCase,
    private readonly createSector: CreateSectorUseCase,
    private readonly updateSector: UpdateSectorUseCase,
    private readonly deactivateSector: DeactivateSectorUseCase,
  ) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.getSectores.execute();
    res.status(200).json({ items });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const params = sectorIdParamsSchema.parse(req.params);
    const item = await this.getSectorById.execute(params.id);
    res.status(200).json({ item });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const data = createSectorSchema.parse(req.body);
    const item = await this.createSector.execute({
      idMunicipio: data.idMunicipio,
      sectorBarrio: data.sectorBarrio,
      circunscripcion: data.circunscripcion ?? null,
      latitud: data.latitud ?? null,
      longitud: data.longitud ?? null,
      creadoPor: idUsuario,
    });
    res.status(201).json({ item });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = sectorIdParamsSchema.parse(req.params);
    const data = updateSectorSchema.parse(req.body);
    const item = await this.updateSector.execute(params.id, {
      idMunicipio: data.idMunicipio,
      sectorBarrio: data.sectorBarrio,
      circunscripcion: data.circunscripcion,
      latitud: data.latitud ?? undefined,
      longitud: data.longitud ?? undefined,
      activo: data.activo,
      actualizadoPor: idUsuario,
    });
    res.status(200).json({ item });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = sectorIdParamsSchema.parse(req.params);
    await this.deactivateSector.execute(params.id, idUsuario);
    res.status(204).send();
  };
}
