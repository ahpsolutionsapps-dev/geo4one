import { ConflictError } from '../../../../core/errors/app-error';
import { UserRepository } from '../../domain/repositories/user-repository';
import { PasswordHasher } from '../../domain/services/password-hasher';
import { TokenService } from '../../domain/services/token-service';
import { AuthResponseDTO } from '../dto/auth-response.dto';

export interface RegisterUserInput {
  username: string;
  email: string;
  password: string;
  idRol?: number | null;
  palabraSecreta?: string | null;
  imagen?: string | null;
  comentario?: string | null;
  idUsuarioRegistra?: number | null;
}

export class RegisterUserUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenService,
  ) {}

  async execute(input: RegisterUserInput): Promise<AuthResponseDTO> {
    const existing = await this.users.findByUsername(input.username);
    if (existing) {
      throw new ConflictError('El nombre de usuario ya está registrado');
    }

    const userpassword = await this.hasher.hash(input.password);
    const user = await this.users.create({
      idNegocio: 1,
      username: input.username,
      email: input.email,
      userpassword,
      nombre: input.username,
      apellido: null,
      telefono: null,
      idRol: input.idRol ?? null,
      palabraSecreta: input.palabraSecreta ?? null,
      habilitado: true,
      imagen: null,
      idUsuarioRegistra: input.idUsuarioRegistra ?? null,
      idUsuarioModifica: null,
      fechaModificacion: null,
      anulado: false,
      idUsuarioAnula: null,
      fechaAnulado: null,
      comentario: input.comentario ?? null,
      verificado: false,
      estatus: 1,
      idioma: 'es',
      tema: 'sistema',
      intentosFallidos: 0,
    });

    const token = this.tokens.sign({ sub: String(user.idUsuario), username: user.username });
    return { user: user.toPublic(), token };
  }
}
