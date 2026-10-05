"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_DARK_COLOR_SCHEME = exports.DEFAULT_THEME_MODE = exports.DARK_COLOR_SCHEMES = exports.THEME_MODES = void 0;
exports.temaToThemeMode = temaToThemeMode;
exports.themeModeToTema = themeModeToTema;
exports.isThemeMode = isThemeMode;
exports.isDarkColorScheme = isDarkColorScheme;
exports.THEME_MODES = ['light', 'dark', 'system'];
exports.DARK_COLOR_SCHEMES = [
    'cinder',
    'navy',
    'mirage',
    'black',
    'mint',
];
exports.DEFAULT_THEME_MODE = 'system';
exports.DEFAULT_DARK_COLOR_SCHEME = 'cinder';
const TEMA_TO_THEME_MODE = {
    claro: 'light',
    oscuro: 'dark',
    sistema: 'system',
};
const THEME_MODE_TO_TEMA = {
    light: 'claro',
    dark: 'oscuro',
    system: 'sistema',
};
function temaToThemeMode(tema) {
    if (!tema) {
        return exports.DEFAULT_THEME_MODE;
    }
    return TEMA_TO_THEME_MODE[tema] ?? exports.DEFAULT_THEME_MODE;
}
function themeModeToTema(themeMode) {
    return THEME_MODE_TO_TEMA[themeMode];
}
function isThemeMode(value) {
    return (typeof value === 'string' &&
        exports.THEME_MODES.includes(value));
}
function isDarkColorScheme(value) {
    return (typeof value === 'string' &&
        exports.DARK_COLOR_SCHEMES.includes(value));
}
//# sourceMappingURL=theme-preferences.mapper.js.map