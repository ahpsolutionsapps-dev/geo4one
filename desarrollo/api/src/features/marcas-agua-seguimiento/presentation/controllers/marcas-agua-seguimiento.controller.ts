import { Request, Response } from 'express';
import { getAuthUserId } from '../../../../shared/presentation/get-auth-user-id';
import { CreateMarcaAguaSeguimientoUseCase } from '../../application/use-cases/create-marca-agua-seguimiento.use-case';
import { DeactivateMarcaAguaSeguimientoUseCase } from '../../application/use-cases/deactivate-marca-agua-seguimiento.use-case';
import { GetMarcaAguaSeguimientoByIdUseCase } from '../../application/use-cases/get-marca-agua-seguimiento-by-id.use-case';
import { GetMarcasAguaSeguimientoUseCase } from '../../application/use-cases/get-marcas-agua-seguimiento.use-case';
import { GetVersionesCampanaOptionsUseCase } from '../../application/use-cases/get-versiones-campana-options.use-case';
import { UpdateMarcaAguaSeguimientoUseCase } from '../../application/use-cases/update-marca-agua-seguimiento.use-case';
import {
  createMarcaAguaSeguimientoSchema,
  marcaAguaSeguimientoIdParamsSchema,
  updateMarcaAguaSeguimientoSchema,
} from '../validators/marcas-agua-seguimiento.schemas';

export class MarcasAguaSeguimientoController {
  constructor(
    private readonly getMarcasAguaSeguimiento: GetMarcasAguaSeguimientoUseCase,
    private readonly getMarcaAguaSeguimientoById: GetMarcaAguaSeguimientoByIdUseCase,
    private readonly getVersionesCampanaOptions: GetVersionesCampanaOptionsUseCase,
    private readonly createMarcaAguaSeguimiento: CreateMarcaAguaSeguimientoUseCase,
    private readonly updateMarcaAguaSeguimiento: UpdateMarcaAguaSeguimientoUseCase,
    private readonly deactivateMarcaAguaSeguimiento: DeactivateMarcaAguaSeguimientoUseCase,
  ) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.getMarcasAguaSeguimiento.execute();
    res.status(200).json({ items });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const params = marcaAguaSeguimientoIdParamsSchema.parse(req.params);
    const item = await this.getMarcaAguaSeguimientoById.execute(params.id);
    res.status(200).json({ item });
  };

  listVersionesOptions = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.getVersionesCampanaOptions.execute();
    res.status(200).json({ items });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const data = createMarcaAguaSeguimientoSchema.parse(req.body);
    const item = await this.createMarcaAguaSeguimiento.execute({
      idVersionCampana: data.idVersionCampana,
      imagenMuestra: data.imagenMuestra,
      videoMuestra: data.videoMuestra,
      creadoPor: idUsuario,
    });
    res.status(201).json({ item });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = marcaAguaSeguimientoIdParamsSchema.parse(req.params);
    const data = updateMarcaAguaSeguimientoSchema.parse(req.body);
    const item = await this.updateMarcaAguaSeguimiento.execute(params.id, {
      idVersionCampana: data.idVersionCampana,
      imagenMuestra: data.imagenMuestra,
      videoMuestra: data.videoMuestra,
      activo: data.activo,
      actualizadoPor: idUsuario,
    });
    res.status(200).json({ item });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = marcaAguaSeguimientoIdParamsSchema.parse(req.params);
    await this.deactivateMarcaAguaSeguimiento.execute(params.id, idUsuario);
    res.status(204).send();
  };
}
