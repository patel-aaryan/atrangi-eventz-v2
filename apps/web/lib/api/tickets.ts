/**
 * API Client for Tickets
 */

interface ReserveTicketsRequest {
  eventId: string;
  tierIndex: number;
  quantity: number;
}

interface ReserveTicketsResponse {
  reservationId: string;
  createdAt: number;
}

interface BatchReserveTicketsRequest {
  eventId: string;
  reservations: Array<{ tierIndex: number; quantity: number }>;
}

interface BatchReserveTicketsResponse {
  reservationId: string;
  createdAt: number;
}

export interface ReservationResult {
  reservationId: string;
  createdAt: number;
}

interface ApiErrorResponse {
  error: string;
  message?: string;
}

interface GetReservationsResponse {
  reservations: Array<{ tierIndex: number; quantity: number }>;
}

/**
 * Reserve tickets for an event
 * Creates a reservation that expires in 20 minutes
 * @param params - Reservation parameters (eventId, tierIndex, quantity)
 * @returns The reservation ID
 */
export async function reserveTickets(
  params: ReserveTicketsRequest,
): Promise<string> {
  const response = await fetch("/api/reserve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error: ApiErrorResponse = await response
      .json()
      .catch(() => ({ error: "Failed to reserve tickets" }));
    throw new Error(
      error.message || error.error || "Failed to reserve tickets",
    );
  }

  const data: ReserveTicketsResponse = await response.json();
  return data.reservationId;
}

/**
 * Get reservations for an event by session ID
 * @param eventId - The event ID
 * @returns Array of reservations with tierIndex and quantity
 */
export async function getReservations(
  eventId: string,
): Promise<Array<{ tierIndex: number; quantity: number }>> {
  if (!eventId) throw new Error("Event ID is required to fetch reservations");

  const response = await fetch(
    `/api/reserve?eventId=${encodeURIComponent(eventId)}`,
    { method: "GET", headers: { "Content-Type": "application/json" } },
  );

  if (!response.ok) {
    const error: ApiErrorResponse = await response
      .json()
      .catch(() => ({ error: "Failed to fetch reservations" }));
    throw new Error(
      error.message || error.error || "Failed to fetch reservations",
    );
  }

  const data: GetReservationsResponse = await response.json();
  return data.reservations;
}

/**
 * Reserve multiple tickets for an event in a single atomic operation
 * This prevents race conditions when reserving multiple tickets at once
 * @param params - Batch reservation parameters (eventId, reservations array)
 * @returns Reservation IDs and createdAt timestamp
 */
export async function reserveTicketsBatch(
  params: BatchReserveTicketsRequest,
): Promise<ReservationResult> {
  const response = await fetch("/api/reserve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error: ApiErrorResponse = await response
      .json()
      .catch(() => ({ error: "Failed to reserve tickets" }));
    throw new Error(
      error.message || error.error || "Failed to reserve tickets",
    );
  }

  const data: BatchReserveTicketsResponse = await response.json();
  return { reservationId: data.reservationId, createdAt: data.createdAt };
}
