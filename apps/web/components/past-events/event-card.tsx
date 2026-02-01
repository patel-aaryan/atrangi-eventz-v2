"use client";

import { Card, CardContent, CardTitle } from "@atrangi/ui";
import { Calendar, MapPin, Users, Clock, Award, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { PastEventListItem } from "@atrangi/types";
import { formatDuration } from "@/lib/utils/date";

interface EventCardProps {
  event: PastEventListItem;
}

export function EventCard({ event }: Readonly<EventCardProps>) {
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  const formattedDateMobile = startDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
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
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <CardContent className="p-6 relative mx-4">
            <div className="space-y-4">
              {/* Title Section */}
              <div className="space-y-2 pr-24">
                <CardTitle className="text-2xl md:text-3xl font-bold leading-tight group-hover:text-primary transition-colors">
                  {event.title}
                </CardTitle>
                {event.description && (
                  <p className="text-muted-foreground line-clamp-2 text-sm md:text-base">
                    {event.description}
                  </p>
                )}
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      Attendees
                    </span>
                    <span className="font-semibold text-sm">{attendees}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                    <Award className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      Sponsors
                    </span>
                    <span className="font-semibold text-sm">{sponsors}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                    <Heart className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      Volunteers
                    </span>
                    <span className="font-semibold text-sm">{volunteers}</span>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border/50">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-1.5 rounded-md bg-muted">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Date</span>
                    <span className="font-medium text-foreground md:hidden">
                      {formattedDateMobile}
                    </span>
                    <span className="font-medium text-foreground hidden md:block">
                      {formattedDateDesktop}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="p-1.5 rounded-md bg-muted">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      Duration
                    </span>
                    <span className="font-medium text-foreground">
                      {duration}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="p-1.5 rounded-md bg-muted">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      Location
                    </span>
                    <span className="font-medium text-foreground">
                      {location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
