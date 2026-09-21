import { UnauthorizedError } from '../../../../core/errors/app-error';
import { UserRepository } from '../../domain/repositories/user-repository';
import { PasswordHasher } from '../../domain/services/password-hasher';
import { TokenService } from '../../domain/services/token-service';
import { AuthResponseDTO } from '../dto/auth-response.dto';

export interface LoginUserInput {
  email: string;
  password: string;
}

export class LoginUserUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenService,
  ) {}

  async execute(input: LoginUserInput): Promise<AuthResponseDTO> {
    const user = await this.users.findByEmail(input.email);
    if (!user || !user.canLogin()) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const ok = await this.hasher.compare(input.password, user.userpassword);
    if (!ok) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const token = this.tokens.sign({ sub: String(user.idUsuario), username: user.username });
    return { user: user.toPublic(), token };
  }
}
