import type { UpcomingEventItem } from "@atrangi/types";

/**
 * API Client for Events
 */

interface UpcomingEventResponse {
  event: UpcomingEventItem | null;
  message?: string;
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
