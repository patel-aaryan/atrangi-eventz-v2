import { EventRepository } from "@atrangi/core/repository/event";
import { EventCache } from "@atrangi/core/cache/event";
import { r2Service } from "@atrangi/core/services/r2";
import type {
  GalleryImage,
  PastEventListItem,
  UpcomingEventItem,
  UpcomingEventStatic,
  EventDetail,
  EventDetailStatic,
} from "@atrangi/types";

/**
 * Event Service - Contains business logic for events
 */
class EventService {
  private readonly eventRepository: EventRepository;
  private readonly eventCache: EventCache;

  constructor() {
    this.eventRepository = new EventRepository();
    this.eventCache = new EventCache();
  }

  /**
   * Get past events for showcase with caching
   * Returns simplified data: title, date, attendance, location
   */
  async getPastEvents(): Promise<PastEventListItem[]> {
    // Try to get from cache first
    const cached = await this.eventCache.getPastEvents();

    // Cache hit
    if (cached !== undefined) {
      console.log("📦 [Service] Returning cached past events");
      return cached;
    }

    // Cache miss - query database
    console.log("🗄️ [Service] Fetching past events from database...");
    const events = await this.eventRepository.findPast();

    // Store result in cache
    await this.eventCache.setPastEvents(events);

    console.log("✅ [Service] Database query complete");
    return events;
  }

  /**
   * Get the next upcoming event with caching (optimized for dynamic ticket counts)
   * Caches static data separately and always fetches fresh ticket availability
   * Returns null if no upcoming event is found
   */
  async getUpcomingEvent(): Promise<UpcomingEventItem | null> {
    // Try to get static data from cache first
    const cachedStatic = await this.eventCache.getUpcomingEventStatic();

    let staticData: UpcomingEventStatic | null;

    if (cachedStatic === undefined) {
      // Cache miss - query database for static data
      console.log("🗄️ [Service] Fetching static data from database...");
      staticData = await this.eventRepository.findUpcomingStatic();

      // Store result in cache
      if (staticData) {
        await this.eventCache.setUpcomingEventStatic(staticData);
      } else {
        await this.eventCache.setNoUpcomingEvent();
      }
    } else {
      // Cache hit for static data
      console.log("📦 [Service] Using cached static data");
      staticData = cachedStatic;
    }

    // If no event exists, return null
    if (!staticData) {
      console.log("✅ [Service] No upcoming event found");
      return null;
    }

    // Always fetch fresh ticket availability
    console.log("🎫 [Service] Fetching fresh ticket availability...");
    const availability = await this.eventRepository.getTicketAvailability(
      staticData.id
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
   * Get event details by slug with caching (optimized for dynamic ticket counts)
   * Caches static data separately and always fetches fresh ticket availability
   * Returns null if event is not found
   */
  async getEventBySlug(slug: string): Promise<EventDetail | null> {
    // Try to get static data from cache first
    const cachedStatic = await this.eventCache.getEventDetailStatic(slug);

    let staticData: EventDetailStatic | null;

    if (cachedStatic === undefined) {
      // Cache miss - query database for static data
      console.log(`🗄️ [Service] Fetching static data from database: ${slug}`);
      staticData = await this.eventRepository.findBySlugStatic(slug);

      // Store result in cache
      if (staticData) {
        await this.eventCache.setEventDetailStatic(slug, staticData);
      } else {
        await this.eventCache.setNoEventDetail(slug);
      }
    } else {
      // Cache hit for static data
      console.log(`📦 [Service] Using cached static data for: ${slug}`);
      staticData = cachedStatic;
    }

    // If no event exists, return null
    if (!staticData) {
      console.log(`✅ [Service] No event found for slug: ${slug}`);
      return null;
    }

    // Always fetch fresh ticket availability
    console.log(`🎫 [Service] Fetching fresh ticket availability for: ${slug}`);
    const availability = await this.eventRepository.getTicketAvailability(
      staticData.id
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
   * Get event gallery images from R2 with caching
   * Returns array of image URLs
   */
  async getEventImages(slug: string): Promise<GalleryImage[]> {
    // Try to get from cache first
    const cached = await this.eventCache.getEventImages(slug);

    // Cache hit
    if (cached !== undefined) {
      console.log(`📦 [Service] Returning cached event images: ${slug}`);
      return cached;
    }

    // Cache miss - fetch from R2
    console.log(`🗂️ [Service] Fetching event images from R2: ${slug}`);
    const images = await r2Service.listEventImages(slug);

    // Store result in cache
    await this.eventCache.setEventImages(slug, images);

    console.log("✅ [Service] R2 fetch complete");
    return images;
  }
}

export const eventService = new EventService();
