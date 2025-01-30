import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import { Session } from "./auth";

const authRoutes = ["/sign-in", "/sign-up", "/shelter-sign-up"];
const publicRoutes = ["/", "/adopt-pet", "/about-us","/rehome-pet","/customer-profile","/blog"];
const shelterRoutes = [
  "/shelter-homepage",
  "/shelter-profile",
  "/public-page",
  "/adoption-requests"
];
const adminRoutes = ["/admin-homepage"]; // Add admin routes here

export default async function authMiddleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  
  // Check which type of route is being accessed
  const isAuthRoute = authRoutes.includes(pathName);
  const isPublicRoute = publicRoutes.includes(pathName);
  const isShelterRoute = shelterRoutes.includes(pathName);
  const isAdminRoute = adminRoutes.includes(pathName);

  // Get session
  const { data: session } = await betterFetch<Session>(
    "api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

  // If user is not logged in
  if (!session) {
    // Allow access to public routes and auth routes
    if (isPublicRoute || isAuthRoute) {
      return NextResponse.next();
    }
    // Redirect to sign in for protected routes
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // If user is logged in
  const userRole = session.user?.role;

  // Handle shelter manager access
  if (userRole === "SHELTER_MANAGER") {
    // Check if shelter manager is verified
    if (!session.user?.isVerifiedUser && isShelterRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Prevent access to auth routes
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/shelter-homepage", request.url));
    }
    // Allow access to shelter routes
    if (isShelterRoute) {
      return NextResponse.next();
    }
  }

  // Handle customer access
  if (userRole === "CUSTOMER") {
    // Prevent access to auth routes
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Prevent access to shelter routes
    if (isShelterRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Allow access to public routes
    if (isPublicRoute) {
      return NextResponse.next();
    }
  }

  // Handle admin access (when you implement it)
  if (userRole === "admin") {
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/admin-homepage", request.url));
    }
    if (isAdminRoute) {
      return NextResponse.next();
    }
  }

  // Default: allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Default fallback: redirect to home
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};