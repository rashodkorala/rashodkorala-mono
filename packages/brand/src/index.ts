/**
 * The R K. logo mark: Poppins Bold, R and K a thin space apart, then a full stop.
 * Outlined to a single path so it renders identically everywhere (favicons, share images,
 * the CMS, loading screens) without loading the font. Regenerate if the mark changes.
 */
export const MARK_VIEWBOX = "6.2 29.8 173 71";
export const MARK_PATH =
  "M61.30 100L42 100L27.40 73.50L23.30 73.50L23.30 100L6.20 100L6.20 29.80L34.90 29.80Q43.20 29.80 49.05 32.70Q54.90 35.60 57.80 40.65Q60.70 45.70 60.70 51.90L60.70 51.90Q60.70 58.90 56.75 64.40Q52.80 69.90 45.10 72.20L45.10 72.20L61.30 100ZM23.30 44L23.30 61.40L33.90 61.40Q38.60 61.40 40.95 59.10Q43.30 56.80 43.30 52.60L43.30 52.60Q43.30 48.60 40.95 46.30Q38.60 44 33.90 44L33.90 44L23.30 44ZM153 100L132.10 100L108.50 69L108.50 100L91.40 100L91.40 29.80L108.50 29.80L108.50 60.60L131.90 29.80L152 29.80L124.80 64.20L153 100ZM169.10 100.80Q164.60 100.80 161.75 98.15Q158.90 95.50 158.90 91.60L158.90 91.60Q158.90 87.60 161.75 84.90Q164.60 82.20 169.10 82.20L169.10 82.20Q173.50 82.20 176.35 84.90Q179.20 87.60 179.20 91.60L179.20 91.60Q179.20 95.50 176.35 98.15Q173.50 100.80 169.10 100.80L169.10 100.80Z";

/** Width / height of the mark, for sizing it inside icons and images. */
export const MARK_ASPECT = 2.4366;

/** The mark as a standalone SVG string in one colour. */
export function markSvg(color = "currentColor"): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEWBOX}"><path fill="${color}" d="${MARK_PATH}"/></svg>`;
}

/** The mark as a data: URI, for <img> in next/og ImageResponse. */
export function markDataUri(color: string): string {
  return `data:image/svg+xml;base64,${btoa(markSvg(color))}`;
}
