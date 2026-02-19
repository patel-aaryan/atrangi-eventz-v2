import { EventRepository } from "@atrangi/core/repository/event";
import { r2Service } from "@atrangi/core/services/r2";
import type { TicketAvailability } from "@atrangi/core/types";
import type {
  GalleryImage,
  PastEventListItem,
  UpcomingEventItem,
  UpcomingEventStatic,
  EventDetail,
} from "@atrangi/types";

/**
 * Event Service - Contains business logic for events
 */
class EventService {
  private readonly eventRepository: EventRepository;

  constructor() {
    this.eventRepository = new EventRepository();
  }

  /**
   * Get past events for showcase
   * Returns simplified data: title, date, attendance, location
   */
  async getPastEvents(): Promise<PastEventListItem[]> {
    console.log("🗄️ [Service] Fetching past events from database...");
    const events = await this.eventRepository.findPast();
    console.log("✅ [Service] Database query complete");
    return events;
  }

  /**
   * Get the next upcoming event static data only (no ticket counts).
   * Use for caching; merge with getTicketAvailability() for fresh counts.
   * Returns null if no upcoming event is found.
   */
  async getUpcomingEventStatic(): Promise<UpcomingEventStatic | null> {
    return this.eventRepository.findUpcomingStatic();
  }

  /**
   * Get current ticket availability for an event (dynamic data only).
   * Use with getUpcomingEventStatic() to merge cached static + fresh counts.
   */
  async getTicketAvailability(
    eventId: string
  ): Promise<TicketAvailability | null> {
    return this.eventRepository.getTicketAvailability(eventId);
  }

  /**
   * Get the next upcoming event (optimized for dynamic ticket counts)
   * Returns null if no upcoming event is found
   */
  async getUpcomingEvent(): Promise<UpcomingEventItem | null> {
    const staticData = await this.getUpcomingEventStatic();

    if (!staticData) {
      console.log("✅ [Service] No upcoming event found");
      return null;
    }

    // Always fetch fresh ticket availability
    console.log("🎫 [Service] Fetching fresh ticket availability...");
    const availability = await this.eventRepository.getTicketAvailability(
      staticData.id,
    );

    if (!availability) {
      console.error("⚠️ [Service] Failed to fetch ticket availability");
      // Fallback: use remaining from static data if availability fetch fails
      return {
        ...staticData,
        total_tickets_sold: 0,
        tickets_remaining: staticData.total_capacity || 0,
        is_sold_out: false,
        ticket_tiers: staticData.ticket_tiers, // Already has remaining
      };
    }

    // Merge static data with fresh ticket availability
    const mergedEvent: UpcomingEventItem = {
      ...staticData,
      total_tickets_sold: availability.total_tickets_sold,
      tickets_remaining: availability.tickets_remaining,
      is_sold_out: availability.is_sold_out,
      ticket_tiers: staticData.ticket_tiers.map((tier, index) => ({
        ...tier,
        remaining: availability.ticket_tiers_remaining[index] ?? tier.remaining,
      })),
    };

    console.log("✅ [Service] Event data merged successfully");
    return mergedEvent;
  }

  /**
   * Get event details by slug (optimized for dynamic ticket counts)
   * Returns null if event is not found
   */
  async getEventBySlug(slug: string): Promise<EventDetail | null> {
    console.log(`🗄️ [Service] Fetching static data from database: ${slug}`);
    const staticData = await this.eventRepository.findBySlugStatic(slug);

    if (!staticData) {
      console.log(`✅ [Service] No event found for slug: ${slug}`);
      return null;
    }

    // Always fetch fresh ticket availability
    console.log(`🎫 [Service] Fetching fresh ticket availability for: ${slug}`);
    const availability = await this.eventRepository.getTicketAvailability(
      staticData.id,
    );

    if (!availability) {
      console.error("⚠️ [Service] Failed to fetch ticket availability");
      // Fallback: use remaining from static data if availability fetch fails
      return {
        ...staticData,
        total_tickets_sold: 0,
        tickets_remaining: staticData.total_capacity || 0,
        is_sold_out: false,
        ticket_tiers: staticData.ticket_tiers, // Already has remaining
      };
    }

    // Merge static data with fresh ticket availability
    const mergedEvent: EventDetail = {
      ...staticData,
      total_tickets_sold: availability.total_tickets_sold,
      tickets_remaining: availability.tickets_remaining,
      is_sold_out: availability.is_sold_out,
      ticket_tiers: staticData.ticket_tiers.map((tier, index) => ({
        ...tier,
        remaining: availability.ticket_tiers_remaining[index] ?? tier.remaining,
      })),
    };

    console.log(`✅ [Service] Event data merged successfully for: ${slug}`);
    return mergedEvent;
  }

  /**
   * Get event gallery images from R2
   * Returns array of image URLs
   */
  async getEventImages(slug: string): Promise<GalleryImage[]> {
    console.log(`🗂️ [Service] Fetching event images from R2: ${slug}`);
    const images = await r2Service.listEventImages(slug);
    console.log("✅ [Service] R2 fetch complete");
    return images;
  }
}

export const eventService = new EventService();
