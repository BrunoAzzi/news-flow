import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

const isOnboardingRoute = createRouteMatcher([
  "/onboarding",
  "/onboarding/api-token",
  "/onboarding/topics",
]);
const isPublicRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { isAuthenticated, sessionClaims, redirectToSignIn } = await auth();

  console.log(sessionClaims);
  console.log(isAuthenticated);

  // For users visiting onboarding routes, don't try to redirect
  if (isAuthenticated && (isOnboardingRoute(req) || isPublicRoute(req))) {
    return NextResponse.next();
  }

  // If the user isn't signed in and the route is private, redirect to sign-in
  if (!isAuthenticated && !isPublicRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // Catch users who do not have `onboardingComplete: true` in their publicMetadata
  // Redirect them to the /onboarding route to complete onboarding
  if (isAuthenticated && !sessionClaims?.metadata?.onboardingComplete) {
    console.log("Redirecting to onboarding");
    console.log(sessionClaims);
    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  if (isAuthenticated && !isPublicRoute(req)) return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
