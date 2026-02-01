"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  Skeleton,
  Alert,
  AlertDescription,
  AlertTitle,
} from "@atrangi/ui";
import { AlertCircle, Calendar } from "lucide-react";
import { getPastEvents } from "@/lib/api/events";
import { EventCard } from "./event-card";

export function PastEventsList() {
  // Use React Query for caching
  const {
    data: pastEvents = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["past-events"],
    queryFn: getPastEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
    refetchOnWindowFocus: false, // Don't refetch when user returns to tab
  });

  return (
    <div className="space-y-12">
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <div>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load past events. Please try again later."}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {!isLoading && !error && pastEvents.length === 0 && (
        <div>
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Past Events</h3>
              <p className="text-muted-foreground">
                We haven&apos;t hosted any events yet. Check back soon!
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {!isLoading && !error && pastEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 perspective-[1000px]">
          {pastEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
