// lib/subscriptionStore.ts

let subscriptionActive = false;

export function getSubscription() {
  return subscriptionActive;
}

export function setSubscription(status: boolean) {
  subscriptionActive = status;
}
