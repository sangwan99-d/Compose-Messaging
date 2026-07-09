import colors from '@/constants/colors';

/**
 * Returns the design tokens for the app's active palette.
 *
 * SecureChat ships dark-by-default: the dark palette is used
 * unconditionally for this first build (no light/system-follow toggle
 * exists yet in Settings). `colors.light` is kept in constants/colors.ts
 * so a future "Appearance" setting can switch palettes without
 * redefining tokens.
 */
export function useColors() {
  return { ...colors.dark, radius: colors.radius };
}
