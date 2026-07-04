import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/habits", "/progress", "/coach", "/settings"];

export function middleware(request: NextRequest) {
  const uid = request.cookies.get("arc-uid")?.value;
  const isProtected = PROTECTED_PREFIXES.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  );

  if (isProtected && !uid) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/habits/:path*", "/progress/:path*", "/coach/:path*", "/settings/:path*"],
};