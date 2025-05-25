export const runtime = 'experimental-edge';
import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import { Session } from "./auth";

const authRoutes = ["/sign-in", "/sign-up", "/shelter-sign-up", "/email-verified", "/forgot-password", "/reset-password"];
const publicRoutes = ["/", "/adopt-pet", "/donate", "/donate-to-shelters", "/donation-failure","/donation-success","/payment-failure","/about-us", "/rehome-pet", "/blog", "/new-user", "/privacy-policy", "/terms-of-service", "/pets/"];
const shelterRoutes = [
  "/shelter-homepage",
  "/adoption-requests",
  "/rehoming-requests",
  "/analytics",
  "/add-pet-details/details",
  "/add-pet-details/images",
  "/pet-details/"
];

const customerRoutes= /^\/rehome-pet-request\/[\w-]+$/
const landingPageRoute = ["/shelter-landing-page"];
const petIdPattern = /^\/pets\/[\w-]+$/; 
const adminRoutes = ["/admin-homepage", "/add-blog", "/pet-alerts"]; 

export default async function authMiddleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;
  const isPostAuth = searchParams.get('postAuth') === 'true';
  const customerProfilePattern = /^\/customer-profile\/[\w-]+(\?.*)?$/;
  const shelterProfilePattern = /^\/shelter-profile\/[\w-]+$/;
  const shelterPublicPagePattern = /^\/public-page\/[\w-]+$/;
  const adoptionRequestsPagePattern = /^\/adoption-requests\/[\w-]+$/;
  const isCustomerProfileRoute = customerProfilePattern.test(pathName);
  const isShelterPublicPageRoute = shelterPublicPagePattern.test(pathName);
  const isShelterProfileRoute = shelterProfilePattern.test(pathName);
  const blogPagePattern = /^\/blog\/[\w-]+(\?.*)?$/;
  const DonatePagePattern = /^\/donate\/[\w-]+(\?.*)?$/;
  const isBLogPageRoute = blogPagePattern.test(pathName);

  // Check which type of route is being accessed
  const isAuthRoute = authRoutes.includes(pathName);
  const isCustomerRoute = customerRoutes.test(pathName);
  const isPublicRoute = publicRoutes.includes(pathName) || petIdPattern.test(pathName) || DonatePagePattern.test(pathName)|| isCustomerProfileRoute || isShelterPublicPageRoute || isBLogPageRoute;
  const isShelterRoute = shelterRoutes.some((route) => pathName.startsWith(route))|| adoptionRequestsPagePattern.test(pathName) || isShelterProfileRoute;
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

// If user is logged in
const userRole = session?.user?.user_role;

if (session?.user && session?.user.isDeleted) {
  // User has been deleted, don't return a session
  return NextResponse.redirect(new URL("/", request.url));
}

// Handle post-authentication redirects
if (isPostAuth && session) {
  switch (userRole) {
    case "customer":
      return NextResponse.redirect(new URL("/", request.url));
    case "shelter_manager":
      return NextResponse.redirect(
        new URL(
          session?.user?.isVerifiedUser ? "/shelter-homepage" : "/shelter-landing-page",
          request.url
        )
      );
    case "admin":
      return NextResponse.redirect(new URL("/admin-homepage", request.url));
    default:
      return NextResponse.redirect(new URL("/new-user", request.url));
  }
}

if (isPublicRoute || isAuthRoute) {
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'private, max-age=30');
  return response;
}

// If user is not logged in
if (!session) {
  // Allow access to public routes and auth routes
  if (isPublicRoute || isAuthRoute) {
    return NextResponse.next();
  }
  // Redirect to sign in for protected routes
  return NextResponse.redirect(new URL("/sign-in", request.url));
}

  // Handle shelter manager access
  if (userRole === "shelter_manager") {
    // Check if shelter manager is unverified
    if (!session.user?.isVerifiedUser) {
      // Allow access to the landing page and public routes
      if (isLandingPageRoute || isPublicRoute) {
        const response = NextResponse.next();
        response.headers.set('Cache-Control', 'private, max-age=30');
        return response;
      }
      // Redirect unverified shelter managers to the landing page
      return NextResponse.redirect(new URL("/shelter-landing-page", request.url));
    }

    // If verified, allow access to shelter routes
    if (isShelterRoute) {
      const response = NextResponse.next();
      response.headers.set('Cache-Control', 'private, max-age=30');
      return response;
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
      const response = NextResponse.next();
      response.headers.set('Cache-Control', 'private, max-age=30');
      return response;
    }
  }

  if (userRole === "admin") {
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/admin-homepage", request.url));
    }
    if (isAdminRoute || isPublicRoute) {
      const response = NextResponse.next();
      response.headers.set('Cache-Control', 'private, max-age=30');
      return response;
    }
  }

  // Default: allow access to public routes
  if (isPublicRoute) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'private, max-age=30');
    return response;
  }

  // Default fallback: redirect to home
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};