import { NextResponse } from "next/server";
import { eventService } from "@atrangi/core/services/event";

/**
 * GET /api/events/upcoming
 * Fetch the next upcoming event
 */
export async function GET() {
  // TODO: REMOVE THIS IN NEXT RELEASE
  const isTicketingEnabled = process.env.ENABLE_TICKETING === "true";

  if (!isTicketingEnabled) {
    return NextResponse.json(
      { error: "Ticketing is currently disabled" },
      { status: 403 },
    );
  }
  /////////////////////////////////////

  try {
    const event = await eventService.getUpcomingEvent();

    if (!event) {
      return NextResponse.json(
        { event: null, message: "No upcoming event found" },
        { status: 200 },
      );
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error("Error fetching upcoming event:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch upcoming event",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
