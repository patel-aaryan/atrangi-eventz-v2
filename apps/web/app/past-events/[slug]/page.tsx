import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getEventBySlug, getEventImages } from "@/lib/cache/events";
import {
  EventHero,
  EventGallery,
  EventNotFound,
} from "@/components/event-detail";
import { Button } from "@atrangi/ui";

export default async function EventDetailPage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;

  const [event, images] = await Promise.all([
    getEventBySlug(slug),
    getEventImages(slug),
  ]);

  if (!event) return <EventNotFound message="Event not found" />;

  // Find banner image from gallery
  const bannerImage = images.find((img) =>
    img.name.toLowerCase().includes("title"),
  );

  // Filter out banner from gallery display
  const galleryImages = images.filter(
    (img) => !img.name.toLowerCase().includes("title"),
  );

  return (
    <div className="min-h-screen">
      <EventHero event={event} bannerUrl={bannerImage?.url} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {galleryImages.length > 0 && (
          <>
            <EventGallery images={galleryImages} eventTitle={event.title} />
            {event.album_url && (
              <div className="mb-12 flex justify-center">
                <Button asChild variant="outline" size="lg">
                  <Link
                    href={event.album_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    View full photo album
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
