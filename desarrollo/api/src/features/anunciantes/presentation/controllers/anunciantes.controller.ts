import { Request, Response } from 'express';
import { HttpUploadServiceClient } from '../../../../shared/infrastructure/upload-service/upload-service.client';
import { getAuthUserId } from '../../../../shared/presentation/get-auth-user-id';
import { ImportAnunciantesExcelService } from '../../application/services/import-anunciantes-excel.service';
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
    private readonly uploadService: HttpUploadServiceClient,
    private readonly importAnunciantesExcel: ImportAnunciantesExcelService,
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

    const importResult = await this.importAnunciantesExcel.execute(
      req.file.buffer,
      req.file.originalname,
      idUsuario,
    );

    res.status(201).json({
      success: true,
      message:
        importResult.importedCount > 0
          ? `Se importaron ${importResult.importedCount} anunciantes correctamente`
          : 'No se importaron anunciantes nuevos',
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
