import type {
  PastEventListItem,
  UpcomingEventItem,
  EventDetail,
  GalleryImage,
} from "@atrangi/types";

/**
 * API Client for Events
 */

interface PastEventsResponse {
  events: PastEventListItem[];
  count: number;
}

interface UpcomingEventResponse {
  event: UpcomingEventItem | null;
  message?: string;
}

/**
 * Fetch past events for showcase
 */
export async function getPastEvents(): Promise<PastEventListItem[]> {
  const response = await fetch("/api/events/past", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Failed to fetch past events" }));
    throw new Error(error.error || "Failed to fetch past events");
  }

  const data: PastEventsResponse = await response.json();
  return data.events;
}

/**
 * Fetch the next upcoming event
 * Returns null if no upcoming event is found
 */
export async function getUpcomingEvent(): Promise<UpcomingEventItem | null> {
  const response = await fetch("/api/events/upcoming", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Failed to fetch upcoming event" }));
    throw new Error(error.error || "Failed to fetch upcoming event");
  }

  const data: UpcomingEventResponse = await response.json();
  return data.event;
}

interface EventDetailResponse {
  event: EventDetail;
  images: GalleryImage[];
}

/**
 * Fetch event details by slug
 * Returns event details and gallery images
 */
export async function getEventBySlug(
  slug: string
): Promise<EventDetailResponse> {
  const response = await fetch(`/api/events/${encodeURIComponent(slug)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Failed to fetch event details" }));
    throw new Error(error.error || "Failed to fetch event details");
  }

  const data: EventDetailResponse = await response.json();
  return data;
}
