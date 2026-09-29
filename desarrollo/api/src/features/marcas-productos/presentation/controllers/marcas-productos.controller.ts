import { Request, Response } from 'express';
import { getAuthUserId } from '../../../../shared/presentation/get-auth-user-id';
import { CreateMarcaProductoUseCase } from '../../application/use-cases/create-marca-producto.use-case';
import { DeactivateMarcaProductoUseCase } from '../../application/use-cases/deactivate-marca-producto.use-case';
import { GetMarcaProductoByIdUseCase } from '../../application/use-cases/get-marca-producto-by-id.use-case';
import { GetMarcasProductosUseCase } from '../../application/use-cases/get-marcas-productos.use-case';
import { UpdateMarcaProductoUseCase } from '../../application/use-cases/update-marca-producto.use-case';
import {
  createMarcaProductoSchema,
  marcaProductoIdParamsSchema,
  updateMarcaProductoSchema,
} from '../validators/marcas-productos.schemas';

export class MarcasProductosController {
  constructor(
    private readonly getMarcasProductos: GetMarcasProductosUseCase,
    private readonly getMarcaProductoById: GetMarcaProductoByIdUseCase,
    private readonly createMarcaProducto: CreateMarcaProductoUseCase,
    private readonly updateMarcaProducto: UpdateMarcaProductoUseCase,
    private readonly deactivateMarcaProducto: DeactivateMarcaProductoUseCase,
  ) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.getMarcasProductos.execute();
    res.status(200).json({ items });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const params = marcaProductoIdParamsSchema.parse(req.params);
    const item = await this.getMarcaProductoById.execute(params.id);
    res.status(200).json({ item });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const data = createMarcaProductoSchema.parse(req.body);
    const item = await this.createMarcaProducto.execute({
      idAnunciante: data.idAnunciante,
      idCategoriaAnunciante: data.idCategoriaAnunciante,
      marcaProducto: data.marcaProducto,
      creadoPor: idUsuario,
    });
    res.status(201).json({ item });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = marcaProductoIdParamsSchema.parse(req.params);
    const data = updateMarcaProductoSchema.parse(req.body);
    const item = await this.updateMarcaProducto.execute(params.id, {
      idAnunciante: data.idAnunciante,
      idCategoriaAnunciante: data.idCategoriaAnunciante,
      marcaProducto: data.marcaProducto,
      activo: data.activo,
      actualizadoPor: idUsuario,
    });
    res.status(200).json({ item });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = marcaProductoIdParamsSchema.parse(req.params);
    await this.deactivateMarcaProducto.execute(params.id, idUsuario);
    res.status(204).send();
  };
}