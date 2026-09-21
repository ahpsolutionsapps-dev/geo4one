export const THEME_MODES = ['light', 'dark', 'system'] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

export const DARK_COLOR_SCHEMES = [
  'cinder',
  'navy',
  'mirage',
  'black',
  'mint',
] as const;
export type DarkColorScheme = (typeof DARK_COLOR_SCHEMES)[number];

export const DEFAULT_THEME_MODE: ThemeMode = 'system';
export const DEFAULT_DARK_COLOR_SCHEME: DarkColorScheme = 'cinder';

const TEMA_TO_THEME_MODE: Record<string, ThemeMode> = {
  claro: 'light',
  oscuro: 'dark',
  sistema: 'system',
};

const THEME_MODE_TO_TEMA: Record<ThemeMode, string> = {
  light: 'claro',
  dark: 'oscuro',
  system: 'sistema',
};

export function temaToThemeMode(tema: string | null | undefined): ThemeMode {
  if (!tema) {
    return DEFAULT_THEME_MODE;
  }
  return TEMA_TO_THEME_MODE[tema] ?? DEFAULT_THEME_MODE;
}

export function themeModeToTema(themeMode: ThemeMode): string {
  return THEME_MODE_TO_TEMA[themeMode];
}

export function isThemeMode(value: unknown): value is ThemeMode {
  return (
    typeof value === 'string' &&
    (THEME_MODES as readonly string[]).includes(value)
  );
}

export function isDarkColorScheme(value: unknown): value is DarkColorScheme {
  return (
    typeof value === 'string' &&
    (DARK_COLOR_SCHEMES as readonly string[]).includes(value)
  );
}
