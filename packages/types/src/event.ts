// Event types based on database schema (shared: web + core)

type EventStatus = "draft" | "published" | "cancelled" | "completed";

export interface TicketTier {
  name: string;
  price: number;
  remaining: number;
  available_until?: string | null;
  description?: string;
  features?: string[];
}

export interface PastEventListItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  start_date: string;
  end_date: string;
  venue_name: string | null;
  venue_city: string | null;
  total_tickets_sold: number;
  num_sponsors: number;
  num_volunteers: number;
  banner_image_url: string | null;
}

interface TicketTierStatic {
  name: string;
  price: number;
  remaining: number;
  available_until?: string | null;
  description?: string;
  features?: string[];
}

export interface UpcomingEventStatic {
  id: string;
  title: string;
  slug: string;
  description: string;
  start_date: string;
  end_date: string;
  venue_name: string;
  venue_city: string;
  total_capacity: number;
  ticket_sales_open: string | null;
  ticket_sales_close: string | null;
  ticket_tiers: TicketTierStatic[];
  banner_image_url: string;
}

export interface UpcomingEventItem extends UpcomingEventStatic {
  total_tickets_sold: number;
  tickets_remaining: number;
  is_sold_out: boolean;
  ticket_tiers: TicketTier[];
}

export interface EventDetailStatic {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  start_date: string;
  end_date: string;
  venue_name: string | null;
  venue_address: string | null;
  venue_city: string | null;
  venue_province: string | null;
  venue_postal_code: string | null;
  venue_country: string | null;
  total_capacity: number | null;
  ticket_sales_open: string | null;
  ticket_sales_close: string | null;
  ticket_tiers: TicketTierStatic[];
  num_sponsors: number;
  num_volunteers: number;
  status: EventStatus;
  meta_title: string | null;
  meta_description: string | null;
  tags: string[];
  banner_image_url: string | null;
  album_url: string | null;
}

export interface EventDetail extends EventDetailStatic {
  total_tickets_sold: number;
  tickets_remaining: number;
  is_sold_out: boolean;
  ticket_tiers: TicketTier[];
}
