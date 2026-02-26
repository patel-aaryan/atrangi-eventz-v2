import { unstable_cache } from "next/cache";
import { eventService } from "@atrangi/core/services/event";
import type {
  PastEventListItem,
  UpcomingEventStatic,
  EventDetail,
  GalleryImage,
} from "@atrangi/types";

const PAST_EVENTS_TTL = 43200; // 12 hours in seconds
const UPCOMING_EVENTS_TTL = 3600; // 1 hour in seconds

/**
 * Cached past events for showcase (unstable_cache).
 */
export async function getPastEvents(): Promise<PastEventListItem[]> {
  return unstable_cache(() => eventService.getPastEvents(), ["past-events"], {
    revalidate: PAST_EVENTS_TTL,
  })();
}

/**
 * Cached static data for the next upcoming event (no ticket counts).
 * Merge with fresh availability (e.g. from API) for current ticket data.
 */
export async function getUpcomingEventStatic(): Promise<UpcomingEventStatic | null> {
  return unstable_cache(
    () => eventService.getUpcomingEventStatic(),
    ["upcoming-event-static"],
    { revalidate: UPCOMING_EVENTS_TTL },
  )();
}

/**
 * Cached event detail by slug (for layout generateMetadata).
 */
export async function getEventBySlug(slug: string): Promise<EventDetail | null> {
  return unstable_cache(
    () => eventService.getEventBySlug(slug),
    ["event-by-slug", slug],
    { revalidate: PAST_EVENTS_TTL },
  )();
}

/**
 * Cached gallery images for an event.
 */
export async function getEventImages(slug: string): Promise<GalleryImage[]> {
  return unstable_cache(() => eventService.getEventImages(slug), ["event-images", slug], {
    revalidate: PAST_EVENTS_TTL,
  })();
}
