import { UserRepository } from '../../domain/repositories/user-repository';
import {
  DEFAULT_DARK_COLOR_SCHEME,
  DEFAULT_THEME_MODE,
  isDarkColorScheme,
  isThemeMode,
  temaToThemeMode,
  themeModeToTema,
} from '../../domain/theme-preferences.mapper';
import { NotFoundError } from '../../../../core/errors/app-error';
import {
  publishRealtimeEventToUser,
} from '../../../../shared/infrastructure/events/publish-realtime-event';
import { RealtimeEvents } from '../../../../shared/infrastructure/events/domain-event';
import { UserPreferencesDTO } from './get-user-preferences.use-case';

export type UpdateUserPreferencesInput = {
  primaryColor?: string;
  themeMode?: string;
  darkColorScheme?: string;
};

const DEFAULT_PRIMARY_COLOR = 'brand';

export class UpdateUserPreferencesUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(
    idUsuario: number,
    input: UpdateUserPreferencesInput,
  ): Promise<UserPreferencesDTO> {
    const user = await this.users.findById(idUsuario);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const current = await this.users.getThemePreferences(idUsuario);
    const currentDarkColorScheme = current?.darkColorScheme;
    const preferences: UserPreferencesDTO = {
      primaryColor: input.primaryColor ?? current?.primaryColor ?? DEFAULT_PRIMARY_COLOR,
      themeMode: input.themeMode && isThemeMode(input.themeMode)
        ? input.themeMode
        : temaToThemeMode(current?.tema),
      darkColorScheme:
        input.darkColorScheme && isDarkColorScheme(input.darkColorScheme)
          ? input.darkColorScheme
          : isDarkColorScheme(currentDarkColorScheme)
            ? currentDarkColorScheme
            : DEFAULT_DARK_COLOR_SCHEME,
    };

    await this.users.updateThemePreferences(idUsuario, {
      primaryColor: preferences.primaryColor,
      tema: themeModeToTema(
        isThemeMode(preferences.themeMode)
          ? preferences.themeMode
          : DEFAULT_THEME_MODE,
      ),
      darkColorScheme: preferences.darkColorScheme,
    });

    publishRealtimeEventToUser(
      idUsuario,
      RealtimeEvents.USUARIO_PREFERENCES_UPDATED,
      {
        userId: idUsuario,
        primaryColor: preferences.primaryColor,
        themeMode: preferences.themeMode,
        darkColorScheme: preferences.darkColorScheme,
      },
    );

    return preferences;
  }
}
