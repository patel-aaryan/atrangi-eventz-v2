"use client";

import { Card, CardContent, CardTitle } from "@atrangi/ui";
import { motion } from "framer-motion";
import Link from "next/link";
import type { PastEventListItem } from "@atrangi/types";
import { formatDuration } from "@/lib/utils/date";
import { EventStatsMobile } from "./event-stats-mobile";
import { EventStatsDesktop } from "./event-stats-desktop";

interface EventCardProps {
  event: PastEventListItem;
}

export function EventCard({ event }: Readonly<EventCardProps>) {
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  const formattedDateMobile = startDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });

  const formattedDateDesktop = startDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const duration = formatDuration(startDate, endDate);

  const location = event.venue_name || event.venue_city || "TBA";
  const attendees = event.total_tickets_sold
    ? `${event.total_tickets_sold.toLocaleString()}`
    : "0";
  const sponsors = event.num_sponsors
    ? `${event.num_sponsors.toLocaleString()}`
    : "0";
  const volunteers = event.num_volunteers
    ? `${event.num_volunteers.toLocaleString()}`
    : "0";

  return (
    <Link href={`/past-events/${event.slug}`} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-full transform-3d"
        style={{ transformStyle: "preserve-3d" }}
        whileHover={{
          y: -16,
          rotateX: 8,
          rotateY: -6,
          transition: { duration: 0.3 },
        }}
      >
        <Card className="group relative overflow-hidden border-2 hover:border-primary/50 h-full cursor-pointer shadow-[0_4px_6px_-1px_rgba(0,0,0,0.07),0_10px_25px_-8px_rgba(0,0,0,0.1),0_20px_50px_-12px_rgba(0,0,0,0.08)] transition-shadow duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15),0_25px_60px_-20px_rgba(0,0,0,0.12)]">
          {/* Gradient Background Accent */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />

          <CardContent className="px-6 pt-4 md:p-6 relative z-10 mx-4">
            <div className="space-y-4">
              {/* Title Section */}
              <div className="space-y-2">
                <CardTitle className="text-2xl md:text-3xl font-bold leading-tight group-hover:text-primary transition-colors">
                  {event.title}
                </CardTitle>
                {event.description && (
                  <p className="text-muted-foreground line-clamp-2 text-sm md:text-base">
                    {event.description}
                  </p>
                )}
              </div>

              <EventStatsMobile
                attendees={attendees}
                sponsors={sponsors}
                volunteers={volunteers}
                duration={duration}
                location={location}
                formattedDate={formattedDateMobile}
              />
              <EventStatsDesktop
                attendees={attendees}
                sponsors={sponsors}
                volunteers={volunteers}
                duration={duration}
                location={location}
                formattedDate={formattedDateDesktop}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
