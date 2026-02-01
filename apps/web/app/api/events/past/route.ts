import { NextResponse } from "next/server";
import { eventService } from "@atrangi/core/services/event";

/**
 * GET /api/events/past
 * Fetch past events for showcase
 */
export async function GET() {
  try {
    const events = await eventService.getPastEvents();

    return NextResponse.json({
      events,
      count: events.length,
    });
  } catch (error) {
    console.error("Error fetching past events:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch past events",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
