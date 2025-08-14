import { NextResponse } from "next/server";
import { setSubscription } from "@/lib/subscriptionStore";

export async function POST() {
  setSubscription(true);
  return NextResponse.json({ success: true });
}
