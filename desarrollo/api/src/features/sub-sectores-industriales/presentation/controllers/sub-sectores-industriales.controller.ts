import { Request, Response } from 'express';
import { HttpUploadServiceClient } from '../../../../shared/infrastructure/upload-service/upload-service.client';
import { getAuthUserId } from '../../../../shared/presentation/get-auth-user-id';
import { ImportSubSectoresIndustrialesExcelService } from '../../application/services/import-sub-sectores-industriales-excel.service';
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
    private readonly uploadService: HttpUploadServiceClient,
    private readonly importSubSectoresIndustrialesExcel: ImportSubSectoresIndustrialesExcelService,
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

    const importResult = await this.importSubSectoresIndustrialesExcel.execute(
      req.file.buffer,
      req.file.originalname,
      idUsuario,
    );

    res.status(201).json({
      success: true,
      message:
        importResult.importedCount > 0
          ? `Se importaron ${importResult.importedCount} sub sectores industriales correctamente`
          : 'No se importaron sub sectores industriales nuevos',
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