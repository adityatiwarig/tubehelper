import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ✅ Public pages
const publicRoutes = ["/sign-in", "/sign-up"];

// ✅ Protected pages
const protectedRoutes = ["/home", "/quiz", "/quiz-access"];

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const currentUrl = new URL(req.url);
  const pathname = currentUrl.pathname;

  // Agar logged in user sign-in ya sign-up pe jaa raha hai → home bhej do
  if (userId && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // Agar logged in nahi hai aur protected page access kar raha hai → sign-in bhej do
  if (!userId && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
