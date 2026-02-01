"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { getEventBySlug } from "@/lib/api/events";
import {
  EventHero,
  EventGallery,
  EventDetailSkeleton,
  EventNotFound,
} from "@/components/event-detail";
import { Button } from "@atrangi/ui";

export default function EventDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["event", slug],
    queryFn: () => getEventBySlug(slug),
    enabled: !!slug,
  });

  if (isLoading) return <EventDetailSkeleton />;

  if (error || !data) {
    const errorMessage = error instanceof Error ? error.message : undefined;
    return <EventNotFound message={errorMessage} />;
  }

  const { event, images } = data;

  // Find banner image from gallery
  const bannerImage = images.find((img) =>
    img.name.toLowerCase().includes("title")
  );

  // Filter out banner from gallery display
  const galleryImages = images.filter(
    (img) => !img.name.toLowerCase().includes("title")
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
