import type { SVGProps } from "react";
import { MARK_PATH, MARK_VIEWBOX } from "./index";

/**
 * The R K. mark inline. Takes the text colour (currentColor) and is sized by height,
 * e.g. `style={{ height: "1em" }}` to sit in a line of text. Pass `title=""` when it's decorative.
 */
export function Mark({ title = "R K.", ...props }: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <svg viewBox={MARK_VIEWBOX} role={title ? "img" : undefined} aria-label={title || undefined} fill="currentColor" {...props}>
      <path d={MARK_PATH} />
    </svg>
  );
}
