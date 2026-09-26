import { Request, Response } from 'express';
import { getAuthUserId } from '../../../../shared/presentation/get-auth-user-id';
import { CreateMunicipioUseCase } from '../../application/use-cases/create-municipio.use-case';
import { DeactivateMunicipioUseCase } from '../../application/use-cases/deactivate-municipio.use-case';
import { GetMunicipioByIdUseCase } from '../../application/use-cases/get-municipio-by-id.use-case';
import { GetMunicipiosUseCase } from '../../application/use-cases/get-municipios.use-case';
import { UpdateMunicipioUseCase } from '../../application/use-cases/update-municipio.use-case';
import {
  createMunicipioSchema,
  municipioIdParamsSchema,
  updateMunicipioSchema,
} from '../validators/municipios.schemas';

export class MunicipiosController {
  constructor(
    private readonly getMunicipios: GetMunicipiosUseCase,
    private readonly getMunicipioById: GetMunicipioByIdUseCase,
    private readonly createMunicipio: CreateMunicipioUseCase,
    private readonly updateMunicipio: UpdateMunicipioUseCase,
    private readonly deactivateMunicipio: DeactivateMunicipioUseCase,
  ) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.getMunicipios.execute();
    res.status(200).json({ items });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const params = municipioIdParamsSchema.parse(req.params);
    const item = await this.getMunicipioById.execute(params.id);
    res.status(200).json({ item });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const data = createMunicipioSchema.parse(req.body);
    const item = await this.createMunicipio.execute({
      idProvincia: data.idProvincia,
      municipio: data.municipio,
      latitud: data.latitud ?? null,
      longitud: data.longitud ?? null,
      creadoPor: idUsuario,
    });
    res.status(201).json({ item });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = municipioIdParamsSchema.parse(req.params);
    const data = updateMunicipioSchema.parse(req.body);
    const item = await this.updateMunicipio.execute(params.id, {
      idProvincia: data.idProvincia,
      municipio: data.municipio,
      latitud: data.latitud ?? undefined,
      longitud: data.longitud ?? undefined,
      activo: data.activo,
      actualizadoPor: idUsuario,
    });
    res.status(200).json({ item });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = municipioIdParamsSchema.parse(req.params);
    await this.deactivateMunicipio.execute(params.id, idUsuario);
    res.status(204).send();
  };
}
