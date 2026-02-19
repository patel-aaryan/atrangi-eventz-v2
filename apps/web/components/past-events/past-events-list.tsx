import {
  Card,
  CardContent,
  Alert,
  AlertDescription,
  AlertTitle,
} from "@atrangi/ui";
import { AlertCircle, Calendar } from "lucide-react";
import { getPastEvents } from "@/lib/cache/events";
import { EventCard } from "./event-card";

/**
 * Server component that renders past events (data cached via unstable_cache).
 */
export async function PastEventsList() {
  let pastEvents;
  try {
    pastEvents = await getPastEvents();
  } catch {
    return (
      <div className="space-y-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load past events. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (pastEvents.length === 0) {
    return (
      <div className="space-y-12">
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
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 perspective-[1000px]">
        {pastEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
