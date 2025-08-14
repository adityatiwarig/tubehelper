import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://api.clerk.com/v1/users", {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
  });

  const data = await res.json();
  return NextResponse.json(data);
}
