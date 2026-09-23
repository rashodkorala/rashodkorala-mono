import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals, root metadata images, and anything with a file extension
  // (sitemap.xml, robots.txt, images in /public, …).
  matcher: ["/((?!api|_next|_vercel|opengraph-image|.*\\..*).*)"],
};
