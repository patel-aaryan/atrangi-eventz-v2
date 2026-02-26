"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, type Variants } from "framer-motion";
import { getSupportedEvents } from "@/lib/api/supported-events";
import { SupportedEventCard } from "./supported-event-card";
import { mapToSupportedEventItem } from "@/lib/utils/supported-events";

interface SupportedEventsGridProps {
  fadeInUp: Variants;
}

export function SupportedEventsGrid({
  fadeInUp,
}: Readonly<SupportedEventsGridProps>) {
  const {
    data: supportedEvents = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["supported-events"],
    queryFn: getSupportedEvents,
  });

  const items = supportedEvents.map(mapToSupportedEventItem);

  return (
    <div className="mb-20">
      {isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          Loading supported events...
        </div>
      )}

      {error && (
        <div className="text-center py-12 text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load supported events."}
        </div>
      )}

      {!isLoading && !error && items.length > 0 && (
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={{
            initial: {},
            animate: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-5xl mx-auto"
        >
          {items.map((item, index) => (
            <SupportedEventCard
              key={`${item.name}-${item.monthYear}-${index}`}
              item={item}
              variants={fadeInUp}
            />
          ))}
        </motion.div>
      )}

      {!isLoading && !error && items.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No supported events to display yet.
        </div>
      )}
    </div>
  );
}
