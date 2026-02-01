import { NextRequest, NextResponse } from "next/server";
import { reservationService } from "@atrangi/core/services/reservation";
import { handleReservationError } from "@/lib/utils/validation";
import { getOrCreateSessionId } from "@/lib/utils/session";
import {
  handleBatchReservation,
  handleSingleReservation,
} from "@/lib/utils/reservation";

/**
 * GET /api/reservations?eventId=<eventId>
 * Get reservations for the current session
 */
export async function GET(request: NextRequest) {
  // TODO: REMOVE THIS IN NEXT RELEASE
  const isTicketingEnabled = process.env.ENABLE_TICKETING === "true";

  if (!isTicketingEnabled) {
    return NextResponse.json(
      { error: "Ticketing is currently disabled" },
      { status: 403 },
    );
  }
  /////////////////////////////////////

  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json(
        {
          error: "Missing eventId",
          message: "eventId query parameter is required",
        },
        { status: 400 },
      );
    }

    // Get sessionId from cookies
    const sessionId = await getOrCreateSessionId();

    // Get reservations for this session
    const reservations = await reservationService.getReservationsBySession(
      eventId,
      sessionId,
    );

    return NextResponse.json({ reservations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reservations:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch reservations",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/reserve
 * Reserve tickets for an event
 * Creates a reservation that expires in 20 minutes
 *
 * Supports two modes:
 * 1. Single reservation: { eventId, tierIndex, quantity }
 * 2. Batch reservation: { eventId, reservations: [{ tierIndex, quantity }, ...] }
 */
export async function POST(request: NextRequest) {
  // TODO: REMOVE THIS IN NEXT RELEASE
  const isTicketingEnabled = process.env.ENABLE_TICKETING === "true";

  if (!isTicketingEnabled) {
    return NextResponse.json(
      { error: "Ticketing is currently disabled" },
      { status: 403 },
    );
  }
  /////////////////////////////////////

  try {
    const body = await request.json();
    const { eventId, reservations } = body as {
      eventId?: string;
      reservations?: Array<{ tierIndex: number; quantity: number }>;
    };

    const sessionId = await getOrCreateSessionId();

    // Check if this is a batch reservation
    if (
      reservations &&
      Array.isArray(reservations) &&
      reservations.length > 0
    ) {
      return await handleBatchReservation(
        eventId || "",
        reservations,
        sessionId,
      );
    }

    // Single reservation mode (backward compatible)
    return await handleSingleReservation(body, sessionId);
  } catch (error) {
    return handleReservationError(error);
  }
}
