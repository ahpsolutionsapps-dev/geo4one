import { Request, Response } from 'express';
import { prisma } from '../../../../core/database/prisma';
import { getAuthNegocioId } from '../../../../shared/presentation/get-auth-negocio-id';
import { getAuthUserId } from '../../../../shared/presentation/get-auth-user-id';
import { AnularRolUseCase } from '../../application/use-cases/anular-rol.use-case';
import { CreateRolUseCase } from '../../application/use-cases/create-rol.use-case';
import { GetModulosCatalogUseCase } from '../../application/use-cases/get-modulos-catalog.use-case';
import { GetRolByIdUseCase } from '../../application/use-cases/get-rol-by-id.use-case';
import { GetRolesUseCase } from '../../application/use-cases/get-roles.use-case';
import { UpdateRolUseCase } from '../../application/use-cases/update-rol.use-case';
import { isSuperAdminUser } from '../../application/helpers/is-super-admin-user';
import {
  createRolSchema,
  getRolesQuerySchema,
  replaceRolModulosSchema,
  rolIdParamsSchema,
  updateRolSchema,
} from '../validators/roles.schemas';
import {
  publishRealtimeEvent,
} from '../../../../shared/infrastructure/events/publish-realtime-event';
import {
  RealtimeEvents,
} from '../../../../shared/infrastructure/events/domain-event';

export class RolesController {
  constructor(
    private readonly getRoles: GetRolesUseCase,
    private readonly getRolById: GetRolByIdUseCase,
    private readonly createRol: CreateRolUseCase,
    private readonly updateRol: UpdateRolUseCase,
    private readonly anularRol: AnularRolUseCase,
    private readonly getModulosCatalog: GetModulosCatalogUseCase,
  ) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const idNegocio = await getAuthNegocioId(req);
    const query = getRolesQuerySchema.parse(req.query);
    const isSuperAdmin = await isSuperAdminUser(prisma, idUsuario);
    const items = await this.getRoles.execute({
      includeAnulados: query.includeAnulados,
      excludeSuperAdmin: !isSuperAdmin,
      idNegocio,
    });
    res.status(200).json({ items });
  };

  listModulos = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const isSuperAdmin = await isSuperAdminUser(prisma, idUsuario);
    const items = await this.getModulosCatalog.execute({
      includeHidden: isSuperAdmin,
    });
    res.status(200).json({ items });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const idNegocio = await getAuthNegocioId(req);
    const params = rolIdParamsSchema.parse(req.params);
    const isSuperAdmin = await isSuperAdminUser(prisma, idUsuario);
    const item = await this.getRolById.execute(params.id, idNegocio, {
      includeHiddenModulos: isSuperAdmin,
      hideSuperAdmin: !isSuperAdmin,
    });
    res.status(200).json({ item });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const idUsuarioRegistra = getAuthUserId(req);
    const idNegocio = await getAuthNegocioId(req);
    const data = createRolSchema.parse(req.body);
    const isSuperAdmin = await isSuperAdminUser(prisma, idUsuarioRegistra);
    const item = await this.createRol.execute({
      idNegocio,
      rol: data.rol,
      descripcion: data.descripcion,
      idModulos: data.idModulos,
      idUsuarioRegistra,
      isSuperAdmin,
    });
    publishRealtimeEvent(RealtimeEvents.ROL_CREATED, { item });
    res.status(201).json({ item });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const idUsuarioModifica = getAuthUserId(req);
    const idNegocio = await getAuthNegocioId(req);
    const params = rolIdParamsSchema.parse(req.params);
    const data = updateRolSchema.parse(req.body);
    const isSuperAdmin = await isSuperAdminUser(prisma, idUsuarioModifica);
    const item = await this.updateRol.execute(params.id, idNegocio, {
      rol: data.rol,
      descripcion: data.descripcion,
      idModulos: data.idModulos,
      comentario: data.comentario,
      idUsuarioModifica,
      isSuperAdmin,
    });
    publishRealtimeEvent(RealtimeEvents.ROL_UPDATED, { item });
    res.status(200).json({ item });
  };

  replaceModulos = async (req: Request, res: Response): Promise<void> => {
    const idUsuarioModifica = getAuthUserId(req);
    const idNegocio = await getAuthNegocioId(req);
    const params = rolIdParamsSchema.parse(req.params);
    const data = replaceRolModulosSchema.parse(req.body);
    const isSuperAdmin = await isSuperAdminUser(prisma, idUsuarioModifica);
    const existing = await this.getRolById.execute(params.id, idNegocio, {
      includeHiddenModulos: isSuperAdmin,
      hideSuperAdmin: !isSuperAdmin,
    });
    const item = await this.updateRol.execute(params.id, idNegocio, {
      rol: existing.rol,
      descripcion: existing.descripcion,
      idModulos: data.idModulos,
      idUsuarioModifica,
      isSuperAdmin,
    });
    publishRealtimeEvent(RealtimeEvents.ROL_UPDATED, { item });
    res.status(200).json({ item });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const idUsuarioAnula = getAuthUserId(req);
    const idNegocio = await getAuthNegocioId(req);
    const params = rolIdParamsSchema.parse(req.params);
    const isSuperAdmin = await isSuperAdminUser(prisma, idUsuarioAnula);
    await this.anularRol.execute(params.id, idNegocio, idUsuarioAnula, {
      isSuperAdmin,
    });
    publishRealtimeEvent(RealtimeEvents.ROL_DELETED, { id: String(params.id) });
    res.status(204).send();
  };
}
