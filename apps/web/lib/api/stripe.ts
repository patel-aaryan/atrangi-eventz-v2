/**
 * Stripe API Client
 * Handles all Stripe-related API calls
 */

interface CreatePaymentIntentParams {
  amount: number; // Amount in cents
  eventId: string;
  eventTitle?: string;
  ticketSelections?: Array<{
    ticketId: string;
    ticketName: string;
    quantity: number;
  }>;
}

interface CreatePaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
}

/**
 * Create a Stripe PaymentIntent for checkout
 * @param params Payment intent parameters
 * @returns Client secret and payment intent ID
 */
export async function createPaymentIntent(
  params: CreatePaymentIntentParams,
): Promise<CreatePaymentIntentResult> {
  const response = await fetch("/api/stripe/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create payment intent");
  }

  return await response.json();
}

/**
 * Cancel a Stripe PaymentIntent
 * @param clientSecret The client secret of the PaymentIntent to cancel
 */
export async function cancelPaymentIntent(clientSecret: string): Promise<void> {
  const response = await fetch("/api/stripe/cancel-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientSecret }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to cancel payment intent");
  }
}
