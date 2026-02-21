export type ReservationData = Array<{
  quantity: number;
  tierIndex: number;
}>;

export interface ReserveTicketsParams {
  eventId: string;
  tierIndex: number;
  requestedQuantity: number;
  sessionId: string;
}

export interface ReserveTicketsResult {
  reservationId: string;
}

export interface BatchReserveTicketsParams {
  eventId: string;
  reservations: Array<{ tierIndex: number; quantity: number }>;
  sessionId: string;
}

export interface BatchReserveTicketsResult {
  reservationId: string;
}
