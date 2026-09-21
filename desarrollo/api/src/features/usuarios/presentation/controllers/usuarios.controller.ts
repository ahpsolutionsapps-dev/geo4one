import { Request, Response } from 'express';
import { prisma } from '../../../../core/database/prisma';
import { ValidationError } from '../../../../core/errors/app-error';
import { getAuthNegocioId } from '../../../../shared/presentation/get-auth-negocio-id';
import { getAuthUserId } from '../../../../shared/presentation/get-auth-user-id';
import { isSuperAdminUser } from '../../../roles/application/helpers/is-super-admin-user';
import { AnularUsuarioUseCase } from '../../application/use-cases/anular-usuario.use-case';
import { CreateUsuarioUseCase } from '../../application/use-cases/create-usuario.use-case';
import { DeleteUsuarioImagenUseCase } from '../../application/use-cases/delete-usuario-imagen.use-case';
import { GetUsuarioByIdUseCase } from '../../application/use-cases/get-usuario-by-id.use-case';
import { GetUsuariosUseCase } from '../../application/use-cases/get-usuarios.use-case';
import { UpdateUsuarioUseCase } from '../../application/use-cases/update-usuario.use-case';
import { UploadUsuarioImagenUseCase } from '../../application/use-cases/upload-usuario-imagen.use-case';
import {
  createUsuarioSchema,
  getUsuariosQuerySchema,
  updateUsuarioSchema,
  usuarioIdParamsSchema,
} from '../validators/usuarios.schemas';
import { RealtimeEvents } from '../../../../shared/infrastructure/events/domain-event';
import { publishRealtimeEvent } from '../../../../shared/infrastructure/events/publish-realtime-event';

function toBooleanFlag(value?: number): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }

  return value === 1;
}

export class UsuariosController {
  constructor(
    private readonly getUsuarios: GetUsuariosUseCase,
    private readonly getUsuarioById: GetUsuarioByIdUseCase,
    private readonly createUsuario: CreateUsuarioUseCase,
    private readonly updateUsuario: UpdateUsuarioUseCase,
    private readonly anularUsuario: AnularUsuarioUseCase,
    private readonly uploadUsuarioImagen: UploadUsuarioImagenUseCase,
    private readonly deleteUsuarioImagen: DeleteUsuarioImagenUseCase,
  ) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const query = getUsuariosQuerySchema.parse(req.query);
    const isSuperAdmin = await isSuperAdminUser(prisma, idUsuario);
    const items = await this.getUsuarios.execute({
      includeAnulados: query.includeAnulados,
      excludeSuperAdmin: !isSuperAdmin,
    });
    res.status(200).json({ items });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const idUsuario = getAuthUserId(req);
    const params = usuarioIdParamsSchema.parse(req.params);
    const isSuperAdmin = await isSuperAdminUser(prisma, idUsuario);
    const item = await this.getUsuarioById.execute(params.id, {
      actorIsSuperAdmin: isSuperAdmin,
    });
    res.status(200).json({ item });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const idUsuarioRegistra = getAuthUserId(req);
    const idNegocio = await getAuthNegocioId(req);
    const data = createUsuarioSchema.parse(req.body);
    const isSuperAdmin = await isSuperAdminUser(prisma, idUsuarioRegistra);
    const item = await this.createUsuario.execute({
      idNegocio,
      username: data.username,
      email: data.email,
      userpassword: data.userpassword,
      nombre: data.nombre,
      apellido: data.apellido ?? null,
      telefono: data.telefono ?? null,
      idRol: data.idRol ?? null,
      palabraSecreta: data.palabraSecreta ?? null,
      habilitado: toBooleanFlag(data.habilitado) ?? true,
      verificado: toBooleanFlag(data.verificado) ?? false,
      estatus: data.estatus ?? 1,
      idioma: data.idioma,
      tema: data.tema,
      comentario: data.comentario ?? null,
      idUsuarioRegistra,
      actorIsSuperAdmin: isSuperAdmin,
    });
    publishRealtimeEvent(RealtimeEvents.USUARIO_CREATED, { item });
    res.status(201).json({ item });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const idUsuarioModifica = getAuthUserId(req);
    const params = usuarioIdParamsSchema.parse(req.params);
    const data = updateUsuarioSchema.parse(req.body);
    const isSuperAdmin = await isSuperAdminUser(prisma, idUsuarioModifica);
    const item = await this.updateUsuario.execute(params.id, {
      username: data.username,
      email: data.email,
      userpassword: data.userpassword ?? null,
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono,
      idRol: data.idRol,
      palabraSecreta: data.palabraSecreta,
      habilitado: toBooleanFlag(data.habilitado),
      verificado: toBooleanFlag(data.verificado),
      estatus: data.estatus,
      idioma: data.idioma,
      tema: data.tema,
      comentario: data.comentario,
      idUsuarioModifica,
      actorIsSuperAdmin: isSuperAdmin,
    });
    publishRealtimeEvent(RealtimeEvents.USUARIO_UPDATED, { item });
    res.status(200).json({ item });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const idUsuarioAnula = getAuthUserId(req);
    const params = usuarioIdParamsSchema.parse(req.params);
    const isSuperAdmin = await isSuperAdminUser(prisma, idUsuarioAnula);
    await this.anularUsuario.execute(params.id, idUsuarioAnula, {
      actorIsSuperAdmin: isSuperAdmin,
    });
    publishRealtimeEvent(RealtimeEvents.USUARIO_DELETED, { id: String(params.id) });
    res.status(204).send();
  };

  uploadImagen = async (req: Request, res: Response): Promise<void> => {
    const idUsuarioModifica = getAuthUserId(req);
    const params = usuarioIdParamsSchema.parse(req.params);

    if (!req.file) {
      throw new ValidationError('Imagen requerida en campo "imagen"');
    }

    const isSuperAdmin = await isSuperAdminUser(prisma, idUsuarioModifica);
    const item = await this.uploadUsuarioImagen.execute({
      idUsuario: params.id,
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      idUsuarioModifica,
      actorIsSuperAdmin: isSuperAdmin,
    });

    publishRealtimeEvent(RealtimeEvents.USUARIO_UPDATED, { item });
    res.status(200).json({ item });
  };

  removeImagen = async (req: Request, res: Response): Promise<void> => {
    const idUsuarioModifica = getAuthUserId(req);
    const params = usuarioIdParamsSchema.parse(req.params);
    const isSuperAdmin = await isSuperAdminUser(prisma, idUsuarioModifica);
    const item = await this.deleteUsuarioImagen.execute(params.id, idUsuarioModifica, {
      actorIsSuperAdmin: isSuperAdmin,
    });
    publishRealtimeEvent(RealtimeEvents.USUARIO_UPDATED, { item });
    res.status(200).json({ item });
  };
}
