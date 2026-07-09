/**
 * Semantic design tokens for SecureChat.
 *
 * Dark mode is the default identity (encrypted messaging = "night ops"
 * feel), with a full light palette available for system light mode.
 * Accent is a deliberate emerald — evokes the "secure/verified" green
 * used by lock icons and encryption badges, not a generic brand blue.
 */

const colors = {
  dark: {
    // Legacy aliases (kept for backward compatibility)
    text: '#EAF3ED',
    tint: '#34D399',

    // Core surfaces
    background: '#0B1210',
    foreground: '#EAF3ED',

    // Cards / elevated surfaces
    card: '#131C19',
    cardForeground: '#EAF3ED',

    // Primary action color (buttons, links, active states, sent bubbles)
    primary: '#22C55E',
    primaryForeground: '#06140C',

    // Secondary / less-emphasis interactive surfaces (received bubbles)
    secondary: '#1B2622',
    secondaryForeground: '#DCEAE3',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#17201D',
    mutedForeground: '#7C9088',

    // Accent highlights (badges, selected items, focus rings, encrypted lock)
    accent: '#34D399',
    accentForeground: '#06140C',

    // Destructive actions (delete, error states)
    destructive: '#F87171',
    destructiveForeground: '#1A0505',

    // Borders and input outlines
    border: '#1F2B26',
    input: '#182420',
  },

  light: {
    text: '#0B1712',
    tint: '#16A34A',

    background: '#F5FAF7',
    foreground: '#0B1712',

    card: '#FFFFFF',
    cardForeground: '#0B1712',

    primary: '#16A34A',
    primaryForeground: '#FFFFFF',

    secondary: '#E9F2EC',
    secondaryForeground: '#12261C',

    muted: '#EDF4F0',
    mutedForeground: '#65756E',

    accent: '#0D9488',
    accentForeground: '#FFFFFF',

    destructive: '#DC2626',
    destructiveForeground: '#FFFFFF',

    border: '#DCE7E1',
    input: '#DCE7E1',
  },

  // Border radius (in px) applied to cards, bubbles, inputs, and modals.
  radius: 18,
};

export default colors;
