import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// Protect /dashboard route
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // allow assets and next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const protectPath = ["/admin"];

  if (protectPath.some((path) => pathname.startsWith(path))) {
    const session = await auth();

    if (!session) {
      const loginUrl = new URL("/sign-in", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}
