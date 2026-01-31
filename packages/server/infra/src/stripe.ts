import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

/**
 * Get the server-side Stripe instance
 * Lazily initialized to avoid build-time errors when env vars aren't available
 */
export function getStripeInstance(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      throw new Error("Missing STRIPE_SECRET_KEY environment variable");
    }

    stripeInstance = new Stripe(secretKey, { typescript: true });
  }

  return stripeInstance;
}
