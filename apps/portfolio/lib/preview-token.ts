import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Preview links from the CMS are signed with the shared PORTFOLIO_REVALIDATE_SECRET, so the
 * secret itself never appears in a URL. Mirrors `apps/cms/lib/portfolio-preview.ts`.
 */
export function previewSignature(secret: string, slug: string, expires: number): string {
  return createHmac("sha256", secret).update(`${slug}.${expires}`).digest("hex");
}

export function isValidPreviewRequest(slug: string, expires: number, signature: string): boolean {
  const secret = process.env.PORTFOLIO_REVALIDATE_SECRET?.trim();
  if (!secret || !slug || !Number.isFinite(expires) || expires < Date.now()) return false;
  const expected = Buffer.from(previewSignature(secret, slug, expires), "hex");
  const given = Buffer.from(signature, "hex");
  return expected.length === given.length && timingSafeEqual(expected, given);
}
