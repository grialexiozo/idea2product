import { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { updateSessionAndAuth } from "./lib/supabase/middleware";

// Define supported locales and default locale
const locales = ["en", "zh-CN"];
const defaultLocale = "en";

export async function middleware(request: NextRequest) {
  // First, handle next-intl internationalization middleware
  const handleIntl = createIntlMiddleware({
    locales,
    defaultLocale,
    localePrefix: "as-needed", // or 'never' | 'as-needed'
    localeDetection: true,
  });
  let response = handleIntl(request);

  // Chain the Supabase middleware, passing it the request and the response from next-intl.
  return await updateSessionAndAuth(request, response);
}

export const config = {
  matcher: ["/", "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2|ttf|eot)$).*)"],
};
