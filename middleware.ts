import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Landing + Auth pages
const isLandingOrAuth = createRouteMatcher(["/", "/sign-in", "/sign-up"]);

// Protected pages
const isProtected = createRouteMatcher(["/home", "/quiz", "/quiz-access"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const url = new URL(req.url);

  // 🚫 If logged in → block landing/auth pages
  if (userId && isLandingOrAuth(req)) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // 🚫 If logged out → block protected pages
  if (!userId && isProtected(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
