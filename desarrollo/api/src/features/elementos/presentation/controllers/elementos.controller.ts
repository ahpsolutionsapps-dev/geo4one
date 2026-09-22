import { Request, Response } from 'express';
import { getAuthUserId } from '../../../../shared/presentation/get-auth-user-id';
import { AnularElementoUseCase } from '../../application/use-cases/anular-elemento.use-case';
import { CreateElementoUseCase } from '../../application/use-cases/create-elemento.use-case';
import { GetElementoByIdUseCase } from '../../application/use-cases/get-elemento-by-id.use-case';
import { GetElementosUseCase } from '../../application/use-cases/get-elementos.use-case';
import { UpdateElementoUseCase } from '../../application/use-cases/update-elemento.use-case';

export class ElementosController {
  constructor(
    private readonly getElementos: GetElementosUseCase,
    private readonly getElementoById: GetElementoByIdUseCase,
    private readonly createElemento: CreateElementoUseCase,
    private readonly updateElemento: UpdateElementoUseCase,
    private readonly anularElemento: AnularElementoUseCase,
  ) {}

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
}
