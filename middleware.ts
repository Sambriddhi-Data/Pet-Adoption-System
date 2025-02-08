import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import { Session } from "./auth";

const authRoutes = ["/sign-in", "/sign-up", "/shelter-sign-up"];
const publicRoutes = ["/", "/adopt-pet", "/about-us", "/rehome-pet", "/customer-profile", "/blog"];
const shelterRoutes = [
  "/shelter-homepage",
  "/pets/[petId]",
  "/shelter-profile",
  "/public-page",
  "/adoption-requests",
  "/add-pet-details/details",
  "/add-pet-details/images",
];
const landingPageRoute = ["/shelter-landing-page"];

const petIdPattern = /^\/pets\/[\w-]+$/; // Matches /pets/{dynamicId}
const adminRoutes = ["/admin-homepage"]; // Add admin routes here

export default async function authMiddleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  // Check which type of route is being accessed
  const isAuthRoute = authRoutes.includes(pathName);
  const isPublicRoute = publicRoutes.includes(pathName) || petIdPattern.test(pathName);
  const isShelterRoute = shelterRoutes.includes(pathName);
  const isAdminRoute = adminRoutes.includes(pathName);
  const isLandingPageRoute = landingPageRoute.includes(pathName);

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
  if (userRole === "shelter_manager") {
    // Check if shelter manager is unverified
    if (!session.user?.isVerifiedUser) {
      // Allow access to the landing page and public routes
      if (isLandingPageRoute || isPublicRoute) {
        return NextResponse.next();
      }
      // Redirect unverified shelter managers to the landing page
      return NextResponse.redirect(new URL("/shelter-landing-page", request.url));
    }

    // If verified, allow access to shelter routes
    if (isShelterRoute) {
      return NextResponse.next();
    }

    // Prevent access to auth routes
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/shelter-homepage", request.url));
    }
  }


  // Handle customer access
  if (userRole === "customer") {
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

  if (userRole === "admin") {
    if (isAuthRoute || isPublicRoute) {
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