import { NextResponse } from "next/server";
import { supportedEventService } from "@atrangi/core/services/supported-event";

/**
 * GET /api/supported-events
 * Fetch all supported events
 */
export async function GET() {
  try {
    const supportedEvents = await supportedEventService.getAllSupportedEvents();

    return NextResponse.json({
      supportedEvents,
      count: supportedEvents.length,
    });
  } catch (error) {
    console.error("Error fetching supported events:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch supported events",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
