import { UnauthorizedError } from '../../../../core/errors/app-error';
import { UserRepository } from '../../domain/repositories/user-repository';
import { PasswordHasher } from '../../domain/services/password-hasher';

export interface ResetPasswordInput {
  email: string;
  palabraSecreta: string;
  password: string;
}

export class ResetPasswordUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
  ) {}

  async execute(input: ResetPasswordInput): Promise<{ message: string }> {
    const email = input.email.trim();
    const palabraSecreta = input.palabraSecreta.trim();
    const user = await this.users.findByEmail(email);

    if (!user || !user.canLogin() || !user.palabraSecreta) {
      throw new UnauthorizedError(
        'No fue posible recuperar la contraseña. Verifica el correo y la palabra secreta.',
      );
    }

    const secretMatches =
      user.palabraSecreta.trim().toLowerCase() === palabraSecreta.toLowerCase();

    if (!secretMatches) {
      throw new UnauthorizedError(
        'No fue posible recuperar la contraseña. Verifica el correo y la palabra secreta.',
      );
    }

    const hashed = await this.hasher.hash(input.password);
    await this.users.updatePassword(user.idUsuario, hashed);

    return { message: 'Contraseña actualizada correctamente' };
  }
}
