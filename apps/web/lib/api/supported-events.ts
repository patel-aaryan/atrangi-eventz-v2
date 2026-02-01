import type { SupportedEvent } from "@atrangi/types";

interface SupportedEventsResponse {
  supportedEvents: SupportedEvent[];
  count: number;
}

/**
 * Fetch all supported events
 */
export async function getSupportedEvents(): Promise<SupportedEvent[]> {
  const response = await fetch("/api/supported-events", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Failed to fetch supported events" }));
    throw new Error(error.error || "Failed to fetch supported events");
  }

  const data: SupportedEventsResponse = await response.json();
  return data.supportedEvents;
}
