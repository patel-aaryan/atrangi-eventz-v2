import { NextResponse } from "next/server";

interface ReservationRequest {
  eventId?: string;
  tierIndex?: number;
  quantity?: number;
}

export function validateReservationRequest(body: ReservationRequest): NextResponse | null {
  const { eventId, tierIndex, quantity } = body;

  // Validate required fields
  if (!eventId || tierIndex === undefined || !quantity) {
    return NextResponse.json(
      { error: "Missing required fields", message: "eventId, tierIndex, and quantity are required" },
      { status: 400 }
    );
  }

  // Validate quantity
  if (typeof quantity !== "number" || quantity <= 0) {
    return NextResponse.json(
      { error: "Invalid quantity", message: "Quantity must be a positive number" },
      { status: 400 }
    );
  }

  // Validate tierIndex
  if (typeof tierIndex !== "number" || tierIndex < 0) {
    return NextResponse.json(
      { error: "Invalid tierIndex", message: "tierIndex must be a non-negative number" },
      { status: 400 }
    );
  }

  return null;
}

export function handleReservationError(error: unknown): NextResponse {
  console.error("Error reserving tickets:", error);

  if (!(error instanceof Error)) {
    return NextResponse.json(
      { error: "Failed to reserve tickets", message: "Unknown error" },
      { status: 500 }
    );
  }

  const message = error.message;

  // Check for availability errors
  if (message.includes("Only") && message.includes("available")) {
    return NextResponse.json(
      { error: "Insufficient tickets", message },
      { status: 409 }
    );
  }

  // Check for lock errors
  if (message.includes("currently being processed")) {
    return NextResponse.json(
      { error: "Event locked", message },
      { status: 423 }
    );
  }

  // Check for validation errors
  if (message.includes("must be") || message.includes("exceeds")) {
    return NextResponse.json(
      { error: "Validation error", message },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { error: "Failed to reserve tickets", message },
    { status: 500 }
  );
}

