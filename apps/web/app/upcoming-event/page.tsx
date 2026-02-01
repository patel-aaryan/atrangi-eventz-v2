"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUpcomingEvent } from "@/lib/api/events";
import { LoadingSpinner } from "@atrangi/ui";
import {
  UpcomingEventDetails,
  UpcomingEventRules,
  UpcomingEventTicketsCTA,
  UpcomingEventEmptyState,
  ScrollExpandMedia
} from "@/components/upcoming-event";

export default function UpcomingEventPage() {
  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["upcoming-event"],
    queryFn: getUpcomingEvent,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    globalThis.scrollTo(0, 0);
    const resetEvent = new Event("resetSection");
    globalThis.dispatchEvent(resetEvent);
  }, []);

  if (isLoading) return <LoadingSpinner text="Loading event..." />;

  if (error || !event) return <UpcomingEventEmptyState />;

  return (
    <div className="min-h-screen">
      <ScrollExpandMedia
        mediaImageSrc={event.banner_image_url}
        title={event.title}
      >
        <div className="space-y-16">
          <UpcomingEventDetails event={event} />
          <UpcomingEventRules event={event} />
          <UpcomingEventTicketsCTA event={event} />
        </div>
      </ScrollExpandMedia>
    </div>
  );
}
