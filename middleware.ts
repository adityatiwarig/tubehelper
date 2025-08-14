import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ✅ Public pages
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in",
  "/sign-up"
]);

// ✅ Protected pages (UI)
const isProtectedRoute = createRouteMatcher([
  "/home",
  "/quiz",
  "/quiz-access"
]);

// ✅ Public APIs (if any)
const isPublicApiRoute = createRouteMatcher([
  // keep empty if no open API
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = new URL(req.url);

  const isApiRequest = pathname.startsWith("/api");

  // 🚫 If logged in & on public page → go to /home
  if (userId && isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // 🚫 If logged out & on protected page → go to /sign-in
  if (!userId && isProtectedRoute(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // 🚫 If logged out & hitting protected API → block
  if (!userId && isApiRequest && !isPublicApiRoute(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)"
  ],
};
