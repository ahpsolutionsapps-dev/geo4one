import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { ConflictError, NotFoundError } from '../../../../core/errors/app-error';
import { getAuthUserId } from '../../../../shared/presentation/get-auth-user-id';
import { positiveIntIdParam } from '../../../../shared/presentation/schemas';
import { AnularElementoUseCase } from '../../application/use-cases/anular-elemento.use-case';
import { CreateElementoUseCase } from '../../application/use-cases/create-elemento.use-case';
import { GetElementoByIdUseCase } from '../../application/use-cases/get-elemento-by-id.use-case';
import { GetElementosUseCase } from '../../application/use-cases/get-elementos.use-case';
import { UpdateElementoUseCase } from '../../application/use-cases/update-elemento.use-case';
import { ElementoRepository } from '../../domain/repositories/elemento-repository';

const catalogIdParamSchema = z.object({
  id: positiveIntIdParam('Id invalido'),
});

const createSimpleCatalogSchema = z.object({
  nombre: z.string().trim().min(2).max(150),
});

const updateSimpleCatalogSchema = z
  .object({
    nombre: z.string().trim().min(2).max(150).optional(),
    activo: z.coerce.boolean().optional(),
  })
  .refine((value) => value.nombre !== undefined || value.activo !== undefined, {
    message: 'Debes enviar al menos un campo para actualizar',
  });

const createFormatoSchema = z.object({
  idTipoElemento: positiveIntIdParam('Id de tipo de elemento invalido'),
  formato: z.string().trim().min(2).max(150),
});

const updateFormatoSchema = z
  .object({
    idTipoElemento: positiveIntIdParam('Id de tipo de elemento invalido').optional(),
    formato: z.string().trim().min(2).max(150).optional(),
    activo: z.coerce.boolean().optional(),
  })
  .refine(
    (value) =>
      value.idTipoElemento !== undefined ||
      value.formato !== undefined ||
      value.activo !== undefined,
    { message: 'Debes enviar al menos un campo para actualizar' },
  );

export class ElementosController {
  constructor(
    private readonly getElementos: GetElementosUseCase,
    private readonly getElementoById: GetElementoByIdUseCase,
    private readonly createElemento: CreateElementoUseCase,
    private readonly updateElemento: UpdateElementoUseCase,
    private readonly anularElemento: AnularElementoUseCase,
    private readonly repository: ElementoRepository,
  ) {}

  private handleCatalogWriteError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictError('Ya existe un registro con esos datos');
      }

      if (error.code === 'P2025') {
        throw new NotFoundError('Registro no encontrado');
      }
    }

    throw error;
  }

  list = async (req: Request, res: Response): Promise<void> => {
    const items = await this.getElementos.execute({
      includeAnulados: req.query.includeAnulados === 'true',
      activo: req.query.activo !== undefined ? req.query.activo === 'true' : undefined,
      termino: typeof req.query.q === 'string' ? req.query.q : undefined,
    });

    res.status(200).json({ items });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const idElemento = Number(req.params.id);
    const item = await this.getElementoById.execute(idElemento);
    res.status(200).json({ item });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const idUsuarioRegistra = getAuthUserId(req);
    const item = await this.createElemento.execute({
      ...req.body,
      idUsuarioRegistra,
    });
    res.status(201).json({ item });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const idUsuarioModifica = getAuthUserId(req);
    const idElemento = Number(req.params.id);
    const item = await this.updateElemento.execute(idElemento, {
      ...req.body,
      idUsuarioModifica,
    });
    res.status(200).json({ item });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const idUsuarioAnula = getAuthUserId(req);
    const idElemento = Number(req.params.id);
    await this.anularElemento.execute(idElemento, idUsuarioAnula);
    res.status(204).send();
  };

  listTiposElementos = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.repository.findTiposElementosCatalogo();
    res.status(200).json({ items });
  };

  createTipoElemento = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const body = createSimpleCatalogSchema.parse(req.body);

    try {
      const item = await this.repository.createTipoElementoCatalogo({
        nombre: body.nombre,
        creadoPor: idUsuario,
      });
      res.status(201).json({ item });
    } catch (error) {
      this.handleCatalogWriteError(error);
    }
  };

  updateTipoElemento = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = catalogIdParamSchema.parse(req.params);
    const body = updateSimpleCatalogSchema.parse(req.body);

    try {
      const item = await this.repository.updateTipoElementoCatalogo(params.id, {
        nombre: body.nombre,
        activo: body.activo,
        actualizadoPor: idUsuario,
      });
      res.status(200).json({ item });
    } catch (error) {
      this.handleCatalogWriteError(error);
    }
  };

  removeTipoElemento = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = catalogIdParamSchema.parse(req.params);

    try {
      await this.repository.deactivateTipoElementoCatalogo(params.id, idUsuario);
      res.status(204).send();
    } catch (error) {
      this.handleCatalogWriteError(error);
    }
  };

  listOrientaciones = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.repository.findOrientacionesCatalogo();
    res.status(200).json({ items });
  };

  createOrientacion = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const body = createSimpleCatalogSchema.parse(req.body);

    try {
      const item = await this.repository.createOrientacionCatalogo({
        nombre: body.nombre,
        creadoPor: idUsuario,
      });
      res.status(201).json({ item });
    } catch (error) {
      this.handleCatalogWriteError(error);
    }
  };

  updateOrientacion = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = catalogIdParamSchema.parse(req.params);
    const body = updateSimpleCatalogSchema.parse(req.body);

    try {
      const item = await this.repository.updateOrientacionCatalogo(params.id, {
        nombre: body.nombre,
        activo: body.activo,
        actualizadoPor: idUsuario,
      });
      res.status(200).json({ item });
    } catch (error) {
      this.handleCatalogWriteError(error);
    }
  };

  removeOrientacion = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = catalogIdParamSchema.parse(req.params);

    try {
      await this.repository.deactivateOrientacionCatalogo(params.id, idUsuario);
      res.status(204).send();
    } catch (error) {
      this.handleCatalogWriteError(error);
    }
  };

  listDimensiones = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.repository.findDimensionesCatalogo();
    res.status(200).json({ items });
  };

  createDimension = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const body = createSimpleCatalogSchema.parse(req.body);

    try {
      const item = await this.repository.createDimensionCatalogo({
        nombre: body.nombre,
        creadoPor: idUsuario,
      });
      res.status(201).json({ item });
    } catch (error) {
      this.handleCatalogWriteError(error);
    }
  };

  updateDimension = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = catalogIdParamSchema.parse(req.params);
    const body = updateSimpleCatalogSchema.parse(req.body);

    try {
      const item = await this.repository.updateDimensionCatalogo(params.id, {
        nombre: body.nombre,
        activo: body.activo,
        actualizadoPor: idUsuario,
      });
      res.status(200).json({ item });
    } catch (error) {
      this.handleCatalogWriteError(error);
    }
  };

  removeDimension = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = catalogIdParamSchema.parse(req.params);

    try {
      await this.repository.deactivateDimensionCatalogo(params.id, idUsuario);
      res.status(204).send();
    } catch (error) {
      this.handleCatalogWriteError(error);
    }
  };

  listFormatos = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.repository.findFormatosCatalogo();
    res.status(200).json({ items });
  };

  createFormato = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const body = createFormatoSchema.parse(req.body);

    try {
      const item = await this.repository.createFormatoCatalogo({
        idTipoElemento: body.idTipoElemento,
        formato: body.formato,
        creadoPor: idUsuario,
      });
      res.status(201).json({ item });
    } catch (error) {
      this.handleCatalogWriteError(error);
    }
  };

  updateFormato = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = catalogIdParamSchema.parse(req.params);
    const body = updateFormatoSchema.parse(req.body);

    try {
      const item = await this.repository.updateFormatoCatalogo(params.id, {
        idTipoElemento: body.idTipoElemento,
        formato: body.formato,
        activo: body.activo,
        actualizadoPor: idUsuario,
      });
      res.status(200).json({ item });
    } catch (error) {
      this.handleCatalogWriteError(error);
    }
  };

  removeFormato = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = catalogIdParamSchema.parse(req.params);

    try {
      await this.repository.deactivateFormatoCatalogo(params.id, idUsuario);
      res.status(204).send();
    } catch (error) {
      this.handleCatalogWriteError(error);
    }
  };
}
