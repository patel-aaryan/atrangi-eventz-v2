import { NextRequest, NextResponse } from "next/server";
import { stripeService } from "@atrangi/core/services/stripe";
import { qstashService } from "@atrangi/core/services/qstash";
import { getOrCreateSessionId } from "@/lib/utils/session";

interface CreatePaymentIntentRequest {
  amount: number; // Amount in cents
  eventId: string;
  eventTitle?: string;
  ticketSelections?: Array<{
    ticketId: string;
    ticketName: string;
    quantity: number;
  }>;
}

/**
 * POST /api/stripe/create-payment-intent
 * Creates a Stripe PaymentIntent for the checkout flow
 */
export async function POST(request: NextRequest) {
  const isTicketingEnabled = process.env.ENABLE_TICKETING === "true";

  if (!isTicketingEnabled) {
    return NextResponse.json(
      { error: "Ticketing is currently disabled" },
      { status: 403 },
    );
  }

  try {
    const body: CreatePaymentIntentRequest = await request.json();
    const { amount, eventId, eventTitle, ticketSelections } = body;

    // Validate required fields
    if (!eventId) {
      return NextResponse.json(
        { error: "Missing eventId", message: "Event ID is required" },
        { status: 400 },
      );
    }

    // Get session ID for tracking
    const sessionId = await getOrCreateSessionId();

    // Create PaymentIntent via service
    const result = await stripeService.createPaymentIntent({
      amount,
      eventId,
      sessionId,
      eventTitle,
      ticketSelections,
    });

    // Schedule automatic cleanup via QStash
    try {
      await qstashService.schedulePaymentCleanup(result.paymentIntentId);
    } catch (qstashError) {
      // Log but don't fail the payment flow
      console.error("Failed to schedule payment cleanup:", qstashError);
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);

    // Handle validation errors
    if (error instanceof Error && error.message.includes("Amount must be")) {
      return NextResponse.json(
        { error: "Invalid amount", message: error.message },
        { status: 400 },
      );
    }

    // Handle Stripe-specific errors
    if (error instanceof Error && "type" in error) {
      const stripeError = error as { type: string; message: string };
      return NextResponse.json(
        {
          error: "Stripe error",
          message: stripeError.message,
          type: stripeError.type,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create payment intent",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
