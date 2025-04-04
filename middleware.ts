import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import { Session } from "./auth";

const authRoutes = ["/sign-in", "/sign-up", "/shelter-sign-up", "/email-verified", "/forgot-password", "/reset-password"];
const publicRoutes = ["/", "/adopt-pet", "/about-us", "/rehome-pet", "/blog", "/new-user", "/pets/"];
const shelterRoutes = [
  "/shelter-homepage",
  "/shelter-profile",
  "/adoption-requests",
  "/rehoming-requests",
  "/add-pet-details/details",
  "/add-pet-details/images",
  "/pet-details/"
];
const customerRoutes= /^\/rehome-pet-request\/[\w-]+$/
const landingPageRoute = ["/shelter-landing-page"];
const petIdPattern = /^\/pets\/[\w-]+$/; 
const adminRoutes = ["/admin-homepage"]; 

export default async function authMiddleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;
  const isPostAuth = searchParams.get('postAuth') === 'true';
  const customerProfilePattern = /^\/customer-profile\/[\w-]+$/;
  const shelterPublicPagePattern = /^\/public-page\/[\w-]+$/;
  const adoptionRequestsPagePattern = /^\/adoption-requests\/[\w-]+$/;
  const isCustomerProfileRoute = customerProfilePattern.test(pathName);
  const isShelterPublicPageRoute = shelterPublicPagePattern.test(pathName);

  // Check which type of route is being accessed
  const isAuthRoute = authRoutes.includes(pathName);
  const isCustomerRoute = customerRoutes.test(pathName);
  const isPublicRoute = publicRoutes.includes(pathName) || petIdPattern.test(pathName) || isCustomerProfileRoute || isShelterPublicPageRoute;
  const isShelterRoute = shelterRoutes.some((route) => pathName.startsWith(route))|| adoptionRequestsPagePattern.test(pathName);
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
  const userRole = session.user?.user_role;

  // Handle post-authentication redirects
  if (isPostAuth) {
    switch (userRole) {
      case "customer":
        return NextResponse.redirect(new URL("/", request.url));
      case "shelter_manager":
        return NextResponse.redirect(
          new URL(
            session.user?.isVerifiedUser ? "/shelter-homepage" : "/shelter-landing-page",
            request.url
          )
        );
      case "admin":
        return NextResponse.redirect(new URL("/admin-homepage", request.url));
      default:
        return NextResponse.redirect(new URL("/new-user", request.url));
    }
  }

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

    // Prevent access to admin routes
    if (isAdminRoute) {
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
    if (isPublicRoute || isCustomerRoute) {
      return NextResponse.next();
    }
  }

  if (userRole === "admin") {
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/admin-homepage", request.url));
    }
    if (isAdminRoute || isPublicRoute) {
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