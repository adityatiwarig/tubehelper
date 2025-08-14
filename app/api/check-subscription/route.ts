import { NextResponse } from "next/server";
import { getSubscription } from "@/lib/subscriptionStore";

export async function GET() {
  // Normally DB check here based on logged-in user
  return NextResponse.json({ active: getSubscription() });
}
