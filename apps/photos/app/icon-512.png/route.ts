import { brandIcon } from "@rashodkorala/brand/icon";

/** Web-app manifest icon (see app/manifest.ts). */
export function GET() {
  return brandIcon(512);
}
