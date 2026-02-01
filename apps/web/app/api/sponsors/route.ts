import { NextResponse } from "next/server";
import { sponsorService } from "@atrangi/core/services/sponsor";

/**
 * GET /api/sponsors
 * Fetch all sponsors
 */
export async function GET() {
  try {
    const sponsors = await sponsorService.getAllSponsors();

    return NextResponse.json({
      sponsors,
      count: sponsors.length,
    });
  } catch (error) {
    console.error("Error fetching sponsors:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch sponsors",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
