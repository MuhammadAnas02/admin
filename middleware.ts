import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function middleware(req: Request) {
  const { userId, claims } = getAuth(req);
  const { pathname } = req.nextUrl;

  // Define public routes that do not require authentication
  const publicRoutes = ["/", "/sign-in"];

  // Allow requests to public routes without further checks
  if (publicRoutes.some((route) => pathname === route)) {
    return NextResponse.next();
  }

  // If the request is for an admin page, enforce admin access
  if (pathname.startsWith("/admin")) {
    // Redirect unauthenticated users to the sign-in page
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // Check the user's public metadata for the isAdmin flag.
    // Depending on your Clerk configuration, the claims might include publicMetadata.
    const isAdmin = claims?.publicMetadata?.isAdmin;
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // For all other routes, proceed normally
  return NextResponse.next();
}

export const config = {
  // Matcher configuration to run the middleware on all paths except for:
  // - Next.js internal paths (_next)
  // - Requests for files with an extension (static assets)
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
