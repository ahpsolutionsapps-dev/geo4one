"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserPreferencesUseCase = void 0;
const theme_preferences_mapper_1 = require("../../domain/theme-preferences.mapper");
const app_error_1 = require("../../../../core/errors/app-error");
const DEFAULT_PRIMARY_COLOR = 'brand';
class GetUserPreferencesUseCase {
    users;
    constructor(users) {
        this.users = users;
    }
    async execute(idUsuario) {
        const user = await this.users.findById(idUsuario);
        if (!user) {
            throw new app_error_1.NotFoundError('Usuario no encontrado');
        }
        const row = await this.users.getThemePreferences(idUsuario);
        const darkColorScheme = row?.darkColorScheme;
        return {
            primaryColor: row?.primaryColor ?? DEFAULT_PRIMARY_COLOR,
            themeMode: (0, theme_preferences_mapper_1.temaToThemeMode)(row?.tema),
            darkColorScheme: (0, theme_preferences_mapper_1.isDarkColorScheme)(darkColorScheme)
                ? darkColorScheme
                : theme_preferences_mapper_1.DEFAULT_DARK_COLOR_SCHEME,
        };
    }
}
exports.GetUserPreferencesUseCase = GetUserPreferencesUseCase;
//# sourceMappingURL=get-user-preferences.use-case.js.map