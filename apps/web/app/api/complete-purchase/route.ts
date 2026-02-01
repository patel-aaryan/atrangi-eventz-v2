import { NextRequest, NextResponse } from "next/server";
import { ticketService } from "@atrangi/core/services/ticket";
import { reservationService } from "@atrangi/core/services/reservation";
import { qstashService } from "@atrangi/core/services/qstash";
import { getOrCreateSessionId } from "@/lib/utils/session";
import { normalizePaymentInfo } from "@atrangi/core/utils/payment";

/**
 * POST /api/purchase/complete
 * Complete a ticket purchase after payment is successful
 * This will be called by Stripe webhook or directly after payment confirmation
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
    const body = await request.json();

    // Validate required fields
    const {
      eventId,
      ticketSelections,
      attendeeInfo,
      contactInfo,
      paymentInfo,
      billingInfo,
      promoCode,
    } = body;

    if (
      !eventId ||
      !ticketSelections ||
      !attendeeInfo ||
      !contactInfo ||
      !paymentInfo
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message:
            "eventId, ticketSelections, attendeeInfo, contactInfo, and paymentInfo are required",
        },
        { status: 400 },
      );
    }

    // Validate paymentInfo structure
    if (
      typeof paymentInfo.subtotal !== "number" ||
      typeof paymentInfo.total !== "number"
    ) {
      return NextResponse.json(
        {
          error: "Invalid payment info",
          message: "paymentInfo must contain valid subtotal and total",
        },
        { status: 400 },
      );
    }

    // Normalize Stripe fields server-side (source of truth) so we always persist a charge id.
    // Stripe.js may not include all fields in the client PaymentIntent shape.
    const normalizedPaymentInfo = await normalizePaymentInfo(
      paymentInfo as Record<string, unknown>,
    );

    // Complete the purchase
    const result = await ticketService.completePurchase({
      eventId,
      ticketSelections,
      attendeeInfo,
      contactInfo,
      paymentInfo: normalizedPaymentInfo as typeof paymentInfo,
      billingInfo,
      promoCode,
    });

    // Cancel the scheduled QStash cleanup message
    try {
      if (paymentInfo.stripePaymentIntentId) {
        await qstashService.cancelPaymentCleanup(
          paymentInfo.stripePaymentIntentId,
        );
      }
    } catch (qstashError) {
      // Log but don't fail the purchase
      console.error("Failed to cancel QStash cleanup message:", qstashError);
    }

    // After a successful purchase, clear any reservations for this session/event
    // so the user's reserved tickets are removed from the cache.
    try {
      const sessionId = await getOrCreateSessionId();
      await reservationService.clearReservationsForSession(eventId, sessionId);
    } catch (cleanupError) {
      // Log cleanup errors but don't fail the purchase response because of them
      console.error(
        "Failed to clear reservations after purchase:",
        cleanupError,
      );
    }

    return NextResponse.json(
      {
        success: true,
        orderId: result.orderId,
        orderNumber: result.orderNumber,
        tickets: result.tickets,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error completing purchase:", error);

    return NextResponse.json(
      {
        error: "Failed to complete purchase",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
