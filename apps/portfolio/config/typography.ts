/**
 * Typography config — edit ACTIVE_PRESET to switch fonts site-wide.
 * Changes take effect on next build / dev restart.
 *
 * Presets:
 *   'geist'   — Geist Sans for everything (clean, minimal)
 *   'classic' — Cormorant Garamond headings + Plus Jakarta Sans body
 *   'custom'  — mix and match manually via the CUSTOM object below
 */

type BodyFont = 'geist' | 'plus-jakarta';
type DisplayFont = 'geist' | 'cormorant';
type FontPreset = 'geist' | 'classic' | 'custom';

const PRESETS: Record<Exclude<FontPreset, 'custom'>, { body: BodyFont; display: DisplayFont }> = {
  geist:   { body: 'geist',        display: 'geist' },
  classic: { body: 'plus-jakarta', display: 'cormorant' },
};

export const ACTIVE_PRESET: FontPreset = 'geist'; // ← change this to switch

// Used only when ACTIVE_PRESET === 'custom'
const CUSTOM: { body: BodyFont; display: DisplayFont } = {
  body:    'geist',
  display: 'cormorant',
};

export const typographyConfig =
  ACTIVE_PRESET === 'custom' ? CUSTOM : PRESETS[ACTIVE_PRESET];
