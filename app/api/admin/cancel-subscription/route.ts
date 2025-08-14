import { NextResponse } from "next/server";
import { setSubscription } from "../check-subscription/route";

export async function POST() {
  // Normally tum DB update karoge yaha
  setSubscription(false); // Cancel karna = false
  return NextResponse.json({ success: true, message: "Subscription canceled" });
}
