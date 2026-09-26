import { Request, Response } from 'express';
import { getAuthUserId } from '../../../../shared/presentation/get-auth-user-id';
import { CreateProvinciaUseCase } from '../../application/use-cases/create-provincia.use-case';
import { DeactivateProvinciaUseCase } from '../../application/use-cases/deactivate-provincia.use-case';
import { GetProvinciaByIdUseCase } from '../../application/use-cases/get-provincia-by-id.use-case';
import { GetProvinciasUseCase } from '../../application/use-cases/get-provincias.use-case';
import { UpdateProvinciaUseCase } from '../../application/use-cases/update-provincia.use-case';
import {
  createProvinciaSchema,
  provinciaIdParamsSchema,
  updateProvinciaSchema,
} from '../validators/provincias.schemas';

export class ProvinciasController {
  constructor(
    private readonly getProvincias: GetProvinciasUseCase,
    private readonly getProvinciaById: GetProvinciaByIdUseCase,
    private readonly createProvincia: CreateProvinciaUseCase,
    private readonly updateProvincia: UpdateProvinciaUseCase,
    private readonly deactivateProvincia: DeactivateProvinciaUseCase,
  ) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.getProvincias.execute();
    res.status(200).json({ items });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const params = provinciaIdParamsSchema.parse(req.params);
    const item = await this.getProvinciaById.execute(params.id);
    res.status(200).json({ item });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const data = createProvinciaSchema.parse(req.body);
    const item = await this.createProvincia.execute({
      provincia: data.provincia,
      latitud: data.latitud ?? null,
      longitud: data.longitud ?? null,
      creadoPor: idUsuario,
    });
    res.status(201).json({ item });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = provinciaIdParamsSchema.parse(req.params);
    const data = updateProvinciaSchema.parse(req.body);
    const item = await this.updateProvincia.execute(params.id, {
      provincia: data.provincia,
      latitud: data.latitud ?? undefined,
      longitud: data.longitud ?? undefined,
      activo: data.activo,
      actualizadoPor: idUsuario,
    });
    res.status(200).json({ item });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = provinciaIdParamsSchema.parse(req.params);
    await this.deactivateProvincia.execute(params.id, idUsuario);
    res.status(204).send();
  };
}
