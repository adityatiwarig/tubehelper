import { NextResponse } from "next/server";

let subscriptionActive = false; // Fake DB variable

export async function GET() {
  // Normally you would check DB here based on logged-in user
  return NextResponse.json({ active: subscriptionActive });
}

export function setSubscription(status: boolean) {
  subscriptionActive = status;
}
