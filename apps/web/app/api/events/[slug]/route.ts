import { NextResponse } from "next/server";
import { eventService } from "@atrangi/core/services/event";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/events/[slug]
 * Fetch event details by slug
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Event slug is required" },
        { status: 400 }
      );
    }

    // Get event details
    const event = await eventService.getEventBySlug(slug);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Get event gallery images from R2
    const images = await eventService.getEventImages(slug);

    return NextResponse.json({
      event,
      images,
    });
  } catch (error) {
    console.error("Error fetching event details:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch event details",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
