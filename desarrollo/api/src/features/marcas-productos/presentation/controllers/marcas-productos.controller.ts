import { Request, Response } from 'express';
import { HttpUploadServiceClient } from '../../../../shared/infrastructure/upload-service/upload-service.client';
import { getAuthUserId } from '../../../../shared/presentation/get-auth-user-id';
import { ImportMarcasProductosExcelService } from '../../application/services/import-marcas-productos-excel.service';
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
    private readonly uploadService: HttpUploadServiceClient,
    private readonly importMarcasProductosExcel: ImportMarcasProductosExcelService,
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

  importExcel = async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'Archivo requerido' });
      return;
    }

    const idUsuario = getAuthUserId(req);
    const uploaded = await this.uploadService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
    );

    const importResult = await this.importMarcasProductosExcel.execute(
      req.file.buffer,
      req.file.originalname,
      idUsuario,
    );

    res.status(201).json({
      success: true,
      message:
        importResult.importedCount > 0
          ? `Se importaron ${importResult.importedCount} marcas correctamente`
          : 'No se importaron marcas nuevas',
      data: {
        id: uploaded.id,
        fileName: uploaded.fileName,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
        hash: '',
        url: uploaded.url,
        importedCount: importResult.importedCount,
        skippedCount: importResult.skippedCount,
        duplicates: importResult.duplicates,
      },
    });
  };
}