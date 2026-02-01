import { eventService } from "@/server/services/event.service";
import { generatePageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

interface EventLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const event = await eventService.getEventBySlug(slug);

    if (!event) {
      return generatePageMetadata({
        title: "Event Not Found",
        description: "The requested event could not be found.",
        path: `/past-events/${slug}`,
      });
    }

    const title = event.meta_title || event.title;
    const description =
      event.meta_description ||
      event.description ||
      `Join us at ${event.title} - an exciting event by Atrangi Eventz.`;

    const keywords = [
      event.title,
      event.venue_city || "",
      "bollywood parties",
      "garba events",
      "indian events",
      "cultural events",
      ...(event.tags || []),
    ].filter(Boolean);

    return generatePageMetadata({
      title,
      description,
      path: `/past-events/${slug}`,
      keywords,
      ogImage: event.banner_image_url || undefined, // Use event's banner as ogImage
    });
  } catch (error) {
    console.error("Error generating metadata for event:", error);
    return {
      title: "Events",
      description: "View event details on Atrangi Eventz.",
    };
  }
}

export default async function EventLayout({
  children,
}: Readonly<EventLayoutProps>) {
  return <>{children}</>;
}
