import { UnauthorizedError } from '../../../../core/errors/app-error';
import { UserRepository } from '../../domain/repositories/user-repository';
import { PasswordHasher } from '../../domain/services/password-hasher';
import { PasswordResetCodeStore } from '../../infrastructure/services/password-reset-code.store';

export interface ConfirmPasswordResetCodeInput {
  email: string;
  code: string;
  password: string;
}

export class ConfirmPasswordResetCodeUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly codes: PasswordResetCodeStore,
  ) {}

  async execute(
    input: ConfirmPasswordResetCodeInput,
  ): Promise<{ message: string }> {
    const email = input.email.trim();
    const user = await this.users.findByEmail(email);

    if (!user || !user.canLogin()) {
      throw new UnauthorizedError(
        'Código inválido o expirado. Solicita uno nuevo.',
      );
    }

    const valid = this.codes.consume(email, input.code);
    if (!valid) {
      throw new UnauthorizedError(
        'Código inválido o expirado. Solicita uno nuevo.',
      );
    }

    const hashed = await this.hasher.hash(input.password);
    await this.users.updatePassword(user.idUsuario, hashed);

    return { message: 'Contraseña actualizada correctamente' };
  }
}
