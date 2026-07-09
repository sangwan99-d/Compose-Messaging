---
name: Expo dark-mode-by-default
description: How to make an Expo app default to dark theme regardless of system appearance setting.
---

The scaffold's `hooks/useColors.ts` picks the dark palette only when
`useColorScheme() === 'dark'`, falling back to light otherwise. When a
product spec calls for dark-by-default (independent of the device's
system appearance), that fallback logic is wrong for the product intent.

**Why:** A messaging/security-themed app wanted a dark UI identity
regardless of the user's OS-level light/dark setting, but the default
hook silently rendered light on devices/browsers reporting a light
system preference.

**How to apply:** When dark-by-default is a real product requirement
(not just "support dark mode"), change `useColors()` to return the dark
palette unconditionally rather than branching on `useColorScheme()`.
Keep the light palette defined in `constants/colors.ts` for a future
manual "Appearance" toggle rather than deleting it.
