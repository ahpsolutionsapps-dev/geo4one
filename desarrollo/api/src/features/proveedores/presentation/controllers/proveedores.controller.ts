import { Request, Response } from 'express';
import { NotFoundError } from '../../../../core/errors/app-error';
import { getAuthUserId } from '../../../../shared/presentation/get-auth-user-id';
import { ProveedorRepository } from '../../domain/repositories/proveedor-repository';
import { CreateProveedorUseCase } from '../../application/use-cases/create-proveedor.use-case';
import { DeactivateProveedorUseCase } from '../../application/use-cases/deactivate-proveedor.use-case';
import { GetProveedorByIdUseCase } from '../../application/use-cases/get-proveedor-by-id.use-case';
import { GetProveedoresUseCase } from '../../application/use-cases/get-proveedores.use-case';
import { UpdateProveedorUseCase } from '../../application/use-cases/update-proveedor.use-case';
import {
  createProveedorSchema,
  createProveedorTelefonoSchema,
  proveedorIdParamsSchema,
  proveedorTelefonoParamsSchema,
  updateProveedorSchema,
  updateProveedorTelefonoSchema,
} from '../validators/proveedores.schemas';

export class ProveedoresController {
  constructor(
    private readonly getProveedores: GetProveedoresUseCase,
    private readonly getProveedorById: GetProveedorByIdUseCase,
    private readonly createProveedor: CreateProveedorUseCase,
    private readonly updateProveedor: UpdateProveedorUseCase,
    private readonly deactivateProveedor: DeactivateProveedorUseCase,
    private readonly proveedorRepository: ProveedorRepository,
  ) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.getProveedores.execute();
    res.status(200).json({ items });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const params = proveedorIdParamsSchema.parse(req.params);
    const item = await this.getProveedorById.execute(params.id);
    res.status(200).json({ item });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const data = createProveedorSchema.parse(req.body);
    const item = await this.createProveedor.execute({
      proveedor: data.proveedor,
      rnc: data.rnc ?? null,
      personaContacto: data.personaContacto ?? null,
      cargo: data.cargo ?? null,
      email: data.email ?? null,
      paginaWeb: data.paginaWeb ?? null,
      direccion: data.direccion ?? null,
      idProvincia: data.idProvincia ?? null,
      idMunicipio: data.idMunicipio ?? null,
      idSectorBarrio: data.idSectorBarrio ?? null,
      creadoPor: idUsuario,
    });

    res.status(201).json({ item });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = proveedorIdParamsSchema.parse(req.params);
    const data = updateProveedorSchema.parse(req.body);

    const item = await this.updateProveedor.execute(params.id, {
      proveedor: data.proveedor,
      rnc: data.rnc,
      personaContacto: data.personaContacto,
      cargo: data.cargo,
      email: data.email,
      paginaWeb: data.paginaWeb,
      direccion: data.direccion,
      idProvincia: data.idProvincia,
      idMunicipio: data.idMunicipio,
      idSectorBarrio: data.idSectorBarrio,
      activo: data.activo,
      actualizadoPor: idUsuario,
    });

    res.status(200).json({ item });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = proveedorIdParamsSchema.parse(req.params);
    await this.deactivateProveedor.execute(params.id, idUsuario);
    res.status(204).send();
  };

  listTelefonos = async (req: Request, res: Response): Promise<void> => {
    const params = proveedorIdParamsSchema.parse(req.params);
    const proveedor = await this.proveedorRepository.findById(params.id);

    if (!proveedor) {
      throw new NotFoundError('Suplidor no encontrado');
    }

    const items = await this.proveedorRepository.findTelefonos(params.id);
    res.status(200).json({ items });
  };

  createTelefono = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = proveedorIdParamsSchema.parse(req.params);
    const data = createProveedorTelefonoSchema.parse(req.body);
    const proveedor = await this.proveedorRepository.findById(params.id);

    if (!proveedor) {
      throw new NotFoundError('Suplidor no encontrado');
    }

    const item = await this.proveedorRepository.createTelefono({
      idProveedor: params.id,
      telefono: data.telefono,
      tipo: data.tipo ?? null,
      principal: data.principal ?? false,
      creadoPor: idUsuario,
    });

    res.status(201).json({ item });
  };

  updateTelefono = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = proveedorTelefonoParamsSchema.parse(req.params);
    const data = updateProveedorTelefonoSchema.parse(req.body);

    const telefono = await this.proveedorRepository.findTelefonoById(params.telefonoId);
    if (!telefono || telefono.idProveedor !== params.id) {
      throw new NotFoundError('Telefono de suplidor no encontrado');
    }

    const item = await this.proveedorRepository.updateTelefono(params.telefonoId, {
      telefono: data.telefono,
      tipo: data.tipo,
      principal: data.principal,
      activo: data.activo,
      actualizadoPor: idUsuario,
    });

    res.status(200).json({ item });
  };

  removeTelefono = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = proveedorTelefonoParamsSchema.parse(req.params);

    const telefono = await this.proveedorRepository.findTelefonoById(params.telefonoId);
    if (!telefono || telefono.idProveedor !== params.id) {
      throw new NotFoundError('Telefono de suplidor no encontrado');
    }

    await this.proveedorRepository.deactivateTelefono(params.telefonoId, idUsuario);
    res.status(204).send();
  };
}
