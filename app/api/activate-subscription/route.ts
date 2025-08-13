import { NextResponse } from "next/server";
import { setSubscription } from "../check-subscription/route";

export async function POST() {
  // Normally DB update hoga yaha
  setSubscription(true);
  return NextResponse.json({ success: true });
}
