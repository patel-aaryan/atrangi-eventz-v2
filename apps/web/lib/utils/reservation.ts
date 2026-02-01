import { NextResponse } from "next/server";
import { validateReservationRequest } from "@/lib/utils/validation";
import { reservationService } from "@atrangi/core/services/reservation";

/**
 * Validate batch reservation request
 */
export function validateBatchReservations(
  reservations: unknown[]
): NextResponse | null {
  for (const reservation of reservations) {
    if (
      typeof reservation !== "object" ||
      reservation === null ||
      !("tierIndex" in reservation) ||
      !("quantity" in reservation)
    ) {
      return NextResponse.json(
        {
          error: "Invalid reservation format",
          message:
            "Each reservation must have tierIndex (number) and quantity (number)",
        },
        { status: 400 }
      );
    }

    const { tierIndex, quantity } = reservation as {
      tierIndex: unknown;
      quantity: unknown;
    };

    if (typeof tierIndex !== "number" || typeof quantity !== "number") {
      return NextResponse.json(
        {
          error: "Invalid reservation format",
          message:
            "Each reservation must have tierIndex (number) and quantity (number)",
        },
        { status: 400 }
      );
    }

    // Match single-reservation validation: tierIndex must be non-negative
    if (tierIndex < 0) {
      return NextResponse.json(
        {
          error: "Invalid tierIndex",
          message: "tierIndex must be a non-negative number",
        },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        {
          error: "Invalid quantity",
          message: "Quantity must be greater than 0",
        },
        { status: 400 }
      );
    }
  }
  return null;
}

/**
 * Handle batch reservation request
 */
export async function handleBatchReservation(
  eventId: string,
  reservations: Array<{ tierIndex: number; quantity: number }>,
  sessionId: string
): Promise<NextResponse> {
  if (!eventId) {
    return NextResponse.json(
      {
        error: "Missing eventId",
        message: "eventId is required for batch reservations",
      },
      { status: 400 }
    );
  }

  const validationError = validateBatchReservations(reservations);
  if (validationError) return validationError;

  const result = await reservationService.reserveTicketsBatch({
    eventId,
    reservations,
    sessionId,
  });

  // Return createdAt timestamp so client can sync reservation timer
  return NextResponse.json(
    { reservationIds: result.reservationIds, createdAt: Date.now() },
    { status: 200 }
  );
}

/**
 * Handle single reservation request
 */
export async function handleSingleReservation(
  body: { eventId?: string; tierIndex?: number; quantity?: number },
  sessionId: string
): Promise<NextResponse> {
  const validationError = validateReservationRequest(body);
  if (validationError) return validationError;

  const { eventId, tierIndex, quantity } = body;

  const result = await reservationService.reserveTickets({
    eventId: eventId!,
    tierIndex: tierIndex!,
    requestedQuantity: quantity!,
    sessionId,
  });

  // Return createdAt timestamp so client can sync reservation timer
  return NextResponse.json(
    { reservationId: result.reservationId, createdAt: Date.now() },
    { status: 200 }
  );
}
