import { UserRepository } from '../../domain/repositories/user-repository';
import {
  DEFAULT_DARK_COLOR_SCHEME,
  DEFAULT_THEME_MODE,
  isDarkColorScheme,
  temaToThemeMode,
} from '../../domain/theme-preferences.mapper';
import { NotFoundError } from '../../../../core/errors/app-error';

export type UserPreferencesDTO = {
  primaryColor: string;
  themeMode: string;
  darkColorScheme: string;
};

const DEFAULT_PRIMARY_COLOR = 'brand';

export class GetUserPreferencesUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(idUsuario: number): Promise<UserPreferencesDTO> {
    const user = await this.users.findById(idUsuario);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const row = await this.users.getThemePreferences(idUsuario);
    const darkColorScheme = row?.darkColorScheme;
    return {
      primaryColor: row?.primaryColor ?? DEFAULT_PRIMARY_COLOR,
      themeMode: temaToThemeMode(row?.tema),
      darkColorScheme: isDarkColorScheme(darkColorScheme)
        ? darkColorScheme
        : DEFAULT_DARK_COLOR_SCHEME,
    };
  }
}
