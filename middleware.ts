import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes that require authentication
  const protectedRoutes = ["/chat", "/wallbed"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // Auth pages that should redirect if user is already logged in
  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // If there is no session and trying to access a protected route
  if (!session && isProtectedRoute) {
    // Store the original URL in the search params
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If there is a session and trying to access auth pages
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Update session if it exists
  if (session) {
    res.headers.set(
      "Cache-Control",
      "private, no-cache, no-store, must-revalidate"
    );
    res.headers.set("Expires", "-1");
    res.headers.set("Pragma", "no-cache");
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
