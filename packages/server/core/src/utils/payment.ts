import { stripeService } from "@atrangi/core/services/stripe";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Normalize Stripe-related fields on the server (source of truth).
 * Ensures we persist `stripeChargeId` even when Stripe.js doesn't expose all fields.
 */
export async function normalizePaymentInfo(
  paymentInfo: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const normalized = { ...paymentInfo };
  const paymentIntentId = normalized.stripePaymentIntentId;

  if (!isNonEmptyString(paymentIntentId)) return normalized;

  try {
    const stripeFields =
      await stripeService.getPaymentIntentPersistenceFields(paymentIntentId);

    if (!normalized.stripeChargeId && isNonEmptyString(stripeFields.stripeChargeId)) {
      normalized.stripeChargeId = stripeFields.stripeChargeId;
    }

    if (
      !normalized.stripePaymentMethodId &&
      isNonEmptyString(stripeFields.stripePaymentMethodId)
    ) {
      normalized.stripePaymentMethodId = stripeFields.stripePaymentMethodId;
    }

    if (
      !normalized.stripeCustomerId &&
      isNonEmptyString(stripeFields.stripeCustomerId)
    ) {
      normalized.stripeCustomerId = stripeFields.stripeCustomerId;
    }

    if (!normalized.paymentStatus && isNonEmptyString(stripeFields.paymentStatus)) {
      normalized.paymentStatus = stripeFields.paymentStatus;
    }
  } catch (stripeError) {
    // Don't fail purchase if Stripe retrieval fails; we'll still have PaymentIntent id for reconciliation.
    console.error("Failed to retrieve PaymentIntent for backfill:", stripeError);
  }

  return normalized;
}


