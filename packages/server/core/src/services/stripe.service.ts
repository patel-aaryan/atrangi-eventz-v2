import { getStripeInstance } from "@atrangi/infra/stripe";
import type Stripe from "stripe";
import type {
  CreatePaymentIntentParams,
  CreatePaymentIntentResult,
} from "@atrangi/core/types";

/**
 * Stripe Service - Handles Stripe payment operations
 */
class StripeService {
  private readonly stripe: Stripe;

  constructor() {
    this.stripe = getStripeInstance();
  }

  /**
   * Create a PaymentIntent for checkout
   * @param params Payment intent parameters
   * @returns Client secret and payment intent ID
   */
  async createPaymentIntent(
    params: CreatePaymentIntentParams,
  ): Promise<CreatePaymentIntentResult> {
    const { amount, eventId, sessionId, eventTitle, ticketSelections } = params;

    // Validate amount
    if (!amount || amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    // Build metadata for tracking
    const metadata = this.buildPaymentMetadata({
      eventId,
      sessionId,
      eventTitle,
      ticketSelections,
    });

    // Create the PaymentIntent
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure it's an integer (cents)
      currency: "cad",
      automatic_payment_methods: { enabled: true },
      metadata,
    });

    if (!paymentIntent.client_secret) {
      throw new Error("Failed to generate client secret");
    }

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  /**
   * Retrieve a PaymentIntent by ID
   * @param paymentIntentId Stripe Payment Intent ID
   */
  async getPaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.retrieve(paymentIntentId);
  }

  /**
   * Derive commonly-needed IDs from a PaymentIntent for persistence.
   * This keeps API routes thin and provides a consistent source of truth.
   */
  async getPaymentIntentPersistenceFields(paymentIntentId: string): Promise<{
    stripeChargeId?: string;
    stripePaymentMethodId?: string;
    stripeCustomerId?: string;
    paymentStatus?: string;
  }> {
    const pi = await this.getPaymentIntent(paymentIntentId);

    const latestCharge = pi.latest_charge;
    const stripeChargeId =
      typeof latestCharge === "string" ? latestCharge : latestCharge?.id;

    const paymentMethod = pi.payment_method;
    const stripePaymentMethodId =
      typeof paymentMethod === "string" ? paymentMethod : paymentMethod?.id;

    const customer = pi.customer;
    const stripeCustomerId =
      typeof customer === "string" ? customer : customer?.id;

    return {
      stripeChargeId,
      stripePaymentMethodId,
      stripeCustomerId,
      paymentStatus: pi.status,
    };
  }

  /**
   * Cancel a PaymentIntent
   * @param paymentIntentId Stripe Payment Intent ID
   */
  async cancelPaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.cancel(paymentIntentId);
  }

  /**
   * Build metadata object for PaymentIntent
   * Stripe metadata values must be strings < 500 characters
   */
  private buildPaymentMetadata(params: {
    eventId: string;
    sessionId: string;
    eventTitle?: string;
    ticketSelections?: Array<{
      ticketId: string;
      ticketName: string;
      quantity: number;
    }>;
  }): Record<string, string> {
    const metadata: Record<string, string> = {
      eventId: params.eventId,
      sessionId: params.sessionId,
    };

    if (params.eventTitle) metadata.eventTitle = params.eventTitle;

    if (params.ticketSelections && params.ticketSelections.length > 0) {
      const ticketSummary = params.ticketSelections
        .map((t) => `${t.quantity}x ${t.ticketName}`)
        .join(", ");

      // Stripe metadata values have a 500 char limit
      metadata.tickets =
        ticketSummary.length > 450
          ? ticketSummary.slice(0, 447) + "..."
          : ticketSummary;
    }

    return metadata;
  }
}

export const stripeService = new StripeService();
