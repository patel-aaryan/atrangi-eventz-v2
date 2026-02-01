"use client";

import { motion } from "framer-motion";
import { Info, MapPin, Building2 } from "lucide-react";
import type { UpcomingEventItem } from "@atrangi/types";

interface UpcomingEventDetailsProps {
  readonly event: UpcomingEventItem;
}

export function UpcomingEventDetails({ event }: UpcomingEventDetailsProps) {
  const hasVenueDetails = event.venue_name || event.venue_city;

  return (
    <motion.section
      id="details"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Info className="w-8 h-8 text-primary" />
          <h2 className="text-3xl sm:text-4xl font-bold">Event Details</h2>
        </div>
        <p className="text-muted-foreground text-lg">
          Everything you need to know about this event
        </p>
      </div>

      {/* Venue Information */}
      {hasVenueDetails && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">Venue</h3>
          </div>
          <div className="pl-7 space-y-1">
            {event.venue_name && (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <p className="text-base font-medium">{event.venue_name}</p>
              </div>
            )}
            {event.venue_city && (
              <p className="text-base text-muted-foreground pl-6">
                {event.venue_city}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Description */}
      {event.description && (
        <div className="space-y-3 pt-4 border-t">
          <h3 className="text-xl font-semibold">About This Event</h3>
          <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {event.description}
          </p>
        </div>
      )}
    </motion.section>
  );
}
