import { Request, Response } from 'express';
import { HttpUploadServiceClient } from '../../../../shared/infrastructure/upload-service/upload-service.client';
import { getAuthUserId } from '../../../../shared/presentation/get-auth-user-id';
import { ImportSectoresIndustrialesExcelService } from '../../application/services/import-sectores-industriales-excel.service';
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
    private readonly uploadService: HttpUploadServiceClient,
    private readonly importSectoresIndustrialesExcel: ImportSectoresIndustrialesExcelService,
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

    const importResult = await this.importSectoresIndustrialesExcel.execute(
      req.file.buffer,
      req.file.originalname,
      idUsuario,
    );

    res.status(201).json({
      success: true,
      message:
        importResult.importedCount > 0
          ? `Se importaron ${importResult.importedCount} sectores industriales correctamente`
          : 'No se importaron sectores industriales nuevos',
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