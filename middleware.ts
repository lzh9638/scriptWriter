import { NextRequest } from "next/server";
import { locales } from "./lib/i18n";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isExit = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  console.log("=====", isExit);
  // 如果请求路径是 API 路由，则直接返回，不进行重定向
  if (pathname.startsWith("/api/")) {
    return;
  }

  if (isExit) return;

  request.nextUrl.pathname = `/`;
  return Response.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next)(?!.*\\.(?:ico|png|svg|jpg|jpeg|xml|txt)$)(?!/api).*)"],
};
