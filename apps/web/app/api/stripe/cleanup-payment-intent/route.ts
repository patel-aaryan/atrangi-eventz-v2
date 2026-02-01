import { NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { stripeService } from "@atrangi/core/services/stripe";

async function handler(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentIntentId } = body;

    if (!paymentIntentId) {
      console.error("[Cleanup] Missing paymentIntentId in request");
      return NextResponse.json({ error: "Missing paymentIntentId" }, { status: 400 });
    }

    console.log(`[Cleanup] Processing cleanup for PaymentIntent: ${paymentIntentId}`);

    try {
      // Get current PaymentIntent status
      const paymentIntent = await stripeService.getPaymentIntent(paymentIntentId);

      // Only cancel if still in cancelable state
      const cancelableStatuses = [
        "requires_payment_method",
        "requires_confirmation",
        "requires_action",
      ];

      if (cancelableStatuses.includes(paymentIntent.status)) {
        await stripeService.cancelPaymentIntent(paymentIntentId);
        console.log(`[Cleanup] Cancelled orphaned PaymentIntent: ${paymentIntentId}`);

        return NextResponse.json({
          success: true,
          action: "cancelled",
          paymentIntentId,
        });
      }

      // Already succeeded, cancelled, or in another state
      console.log(`[Cleanup] PaymentIntent ${paymentIntentId} in status '${paymentIntent.status}', no action needed`);

      return NextResponse.json({
        success: true,
        action: "skipped",
        status: paymentIntent.status,
        paymentIntentId,
      });

    } catch (stripeError) {
      // PaymentIntent might not exist (deleted, etc.)
      console.error(`[Cleanup] Stripe error for ${paymentIntentId}:`, stripeError);

      return NextResponse.json({
        success: true,
        action: "error",
        paymentIntentId,
        error: stripeError instanceof Error ? stripeError.message : "Unknown Stripe error",
      });
    }
  } catch (error) {
    console.error("[Cleanup] Handler error:", error);
    return NextResponse.json(
      { error: "Cleanup handler failed" },
      { status: 500 }
    );
  }
}

// Wrap handler with QStash signature verification
export const POST = verifySignatureAppRouter(handler);

