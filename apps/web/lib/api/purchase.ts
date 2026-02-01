/**
 * API Client for Purchase
 */

import type {
  CompletePurchaseData,
  CompletePurchaseResult,
} from "@atrangi/types";

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

/**
 * Complete a ticket purchase after Stripe payment is successful
 * @param payload - Purchase completion payload
 * @returns Order details and issued tickets
 */
export async function completePurchase(
  payload: CompletePurchaseData
): Promise<CompletePurchaseResult> {
  const response = await fetch("/api/complete-purchase", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error: ApiErrorResponse = await response
      .json()
      .catch(() => ({ message: "We couldn't complete your purchase. Please try again." }));
    throw new Error(
      error.message ||
      error.error ||
      "We couldn't complete your purchase. Please try again."
    );
  }

  const data = (await response.json()) as
    | (CompletePurchaseResult & { success?: boolean })
    | { success?: boolean } & CompletePurchaseResult;

  return data;
}


