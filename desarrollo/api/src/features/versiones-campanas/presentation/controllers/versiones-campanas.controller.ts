import { Request, Response } from 'express';
import { getAuthUserId } from '../../../../shared/presentation/get-auth-user-id';
import { CreateVersionCampanaUseCase } from '../../application/use-cases/create-version-campana.use-case';
import { DeactivateVersionCampanaUseCase } from '../../application/use-cases/deactivate-version-campana.use-case';
import { GetAnunciantesOptionsUseCase } from '../../application/use-cases/get-anunciantes-options.use-case';
import { GetCombosAnunciantesOptionsUseCase } from '../../application/use-cases/get-combos-anunciantes-options.use-case';
import { GetMarcasProductosOptionsUseCase } from '../../application/use-cases/get-marcas-productos-options.use-case';
import { GetVersionCampanaByIdUseCase } from '../../application/use-cases/get-version-campana-by-id.use-case';
import { GetVersionesCampanasUseCase } from '../../application/use-cases/get-versiones-campanas.use-case';
import { UpdateVersionCampanaUseCase } from '../../application/use-cases/update-version-campana.use-case';
import {
  createVersionCampanaSchema,
  marcasProductoOptionsQuerySchema,
  updateVersionCampanaSchema,
  versionCampanaIdParamsSchema,
} from '../validators/versiones-campanas.schemas';

export class VersionesCampanasController {
  constructor(
    private readonly getVersionesCampanas: GetVersionesCampanasUseCase,
    private readonly getVersionCampanaById: GetVersionCampanaByIdUseCase,
    private readonly getAnunciantesOptions: GetAnunciantesOptionsUseCase,
    private readonly getMarcasProductosOptions: GetMarcasProductosOptionsUseCase,
    private readonly getCombosAnunciantesOptions: GetCombosAnunciantesOptionsUseCase,
    private readonly createVersionCampana: CreateVersionCampanaUseCase,
    private readonly updateVersionCampana: UpdateVersionCampanaUseCase,
    private readonly deactivateVersionCampana: DeactivateVersionCampanaUseCase,
  ) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.getVersionesCampanas.execute();
    res.status(200).json({ items });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const params = versionCampanaIdParamsSchema.parse(req.params);
    const item = await this.getVersionCampanaById.execute(params.id);
    res.status(200).json({ item });
  };

  listAnunciantesOptions = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.getAnunciantesOptions.execute();
    res.status(200).json({ items });
  };

  listMarcasProductosOptions = async (req: Request, res: Response): Promise<void> => {
    const query = marcasProductoOptionsQuerySchema.parse(req.query);
    const items = await this.getMarcasProductosOptions.execute(query.idAnunciante);
    res.status(200).json({ items });
  };

  listCombosAnunciantesOptions = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.getCombosAnunciantesOptions.execute();
    res.status(200).json({ items });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const data = createVersionCampanaSchema.parse(req.body);
    const item = await this.createVersionCampana.execute({
      idAnunciante: data.idAnunciante,
      idMarcaProducto: data.idMarcaProducto,
      idComboAnunciante: data.idComboAnunciante,
      versionCampana: data.versionCampana,
      leyendaSeguimiento: data.leyendaSeguimiento,
      creadoPor: idUsuario,
    });
    res.status(201).json({ item });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = versionCampanaIdParamsSchema.parse(req.params);
    const data = updateVersionCampanaSchema.parse(req.body);
    const item = await this.updateVersionCampana.execute(params.id, {
      idAnunciante: data.idAnunciante,
      idMarcaProducto: data.idMarcaProducto,
      idComboAnunciante: data.idComboAnunciante,
      versionCampana: data.versionCampana,
      leyendaSeguimiento: data.leyendaSeguimiento,
      activo: data.activo,
      actualizadoPor: idUsuario,
    });
    res.status(200).json({ item });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = versionCampanaIdParamsSchema.parse(req.params);
    await this.deactivateVersionCampana.execute(params.id, idUsuario);
    res.status(204).send();
  };
}
