"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserPreferencesUseCase = void 0;
const theme_preferences_mapper_1 = require("../../domain/theme-preferences.mapper");
const app_error_1 = require("../../../../core/errors/app-error");
const publish_realtime_event_1 = require("../../../../shared/infrastructure/events/publish-realtime-event");
const domain_event_1 = require("../../../../shared/infrastructure/events/domain-event");
const DEFAULT_PRIMARY_COLOR = 'brand';
class UpdateUserPreferencesUseCase {
    users;
    constructor(users) {
        this.users = users;
    }
    async execute(idUsuario, input) {
        const user = await this.users.findById(idUsuario);
        if (!user) {
            throw new app_error_1.NotFoundError('Usuario no encontrado');
        }
        const current = await this.users.getThemePreferences(idUsuario);
        const currentDarkColorScheme = current?.darkColorScheme;
        const preferences = {
            primaryColor: input.primaryColor ?? current?.primaryColor ?? DEFAULT_PRIMARY_COLOR,
            themeMode: input.themeMode && (0, theme_preferences_mapper_1.isThemeMode)(input.themeMode)
                ? input.themeMode
                : (0, theme_preferences_mapper_1.temaToThemeMode)(current?.tema),
            darkColorScheme: input.darkColorScheme && (0, theme_preferences_mapper_1.isDarkColorScheme)(input.darkColorScheme)
                ? input.darkColorScheme
                : (0, theme_preferences_mapper_1.isDarkColorScheme)(currentDarkColorScheme)
                    ? currentDarkColorScheme
                    : theme_preferences_mapper_1.DEFAULT_DARK_COLOR_SCHEME,
        };
        await this.users.updateThemePreferences(idUsuario, {
            primaryColor: preferences.primaryColor,
            tema: (0, theme_preferences_mapper_1.themeModeToTema)((0, theme_preferences_mapper_1.isThemeMode)(preferences.themeMode)
                ? preferences.themeMode
                : theme_preferences_mapper_1.DEFAULT_THEME_MODE),
            darkColorScheme: preferences.darkColorScheme,
        });
        (0, publish_realtime_event_1.publishRealtimeEventToUser)(idUsuario, domain_event_1.RealtimeEvents.USUARIO_PREFERENCES_UPDATED, {
            userId: idUsuario,
            primaryColor: preferences.primaryColor,
            themeMode: preferences.themeMode,
            darkColorScheme: preferences.darkColorScheme,
        });
        return preferences;
    }
}
exports.UpdateUserPreferencesUseCase = UpdateUserPreferencesUseCase;
//# sourceMappingURL=update-user-preferences.use-case.js.map