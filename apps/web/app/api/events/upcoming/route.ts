import { NextResponse } from "next/server";
import { eventService } from "@atrangi/core/services/event";
import { getUpcomingEventStatic } from "@/lib/cache/events";
import type { UpcomingEventItem } from "@atrangi/types";

/**
 * GET /api/events/upcoming
 * Fetches static event data from cache and merges with fresh ticket availability.
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
    const staticData = await getUpcomingEventStatic();

    if (!staticData) {
      return NextResponse.json(
        { event: null, message: "No upcoming event found" },
        { status: 200 },
      );
    }

    const availability = await eventService.getTicketAvailability(
      staticData.id,
    );

    if (!availability) {
      const fallback: UpcomingEventItem = {
        ...staticData,
        total_tickets_sold: 0,
        tickets_remaining: staticData.total_capacity || 0,
        is_sold_out: false,
        ticket_tiers: staticData.ticket_tiers,
      };
      return NextResponse.json({ event: fallback });
    }

    const event: UpcomingEventItem = {
      ...staticData,
      total_tickets_sold: availability.total_tickets_sold,
      tickets_remaining: availability.tickets_remaining,
      is_sold_out: availability.is_sold_out,
      ticket_tiers: staticData.ticket_tiers.map((tier, index) => ({
        ...tier,
        remaining: availability.ticket_tiers_remaining[index] ?? tier.remaining,
      })),
    };

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
