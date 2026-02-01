export interface TicketAvailability {
  total_tickets_sold: number;
  tickets_remaining: number;
  is_sold_out: boolean;
  ticket_tiers_remaining: number[];
}
