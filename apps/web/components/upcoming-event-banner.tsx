"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { X, Ticket, Clock, Sparkles } from "lucide-react";
import { Button, Badge } from "@atrangi/ui";
import { getUpcomingEvent } from "@/lib/api/events";
import { useSessionStorage } from "@/hooks/use-session-storage";

export function UpcomingEventBanner() {
  const pathname = usePathname();
  const [isDismissed, setIsDismissed] = useSessionStorage(
    "upcoming-event-banner-dismissed",
  );
  const [timeUntil, setTimeUntil] = useState("");

  // Routes where the banner should not be shown
  const hiddenRoutes = new Set([
    "/payment",
    "/checkout",
    "/confirmation",
    "/upcoming-event",
  ]);

  // Use React Query for caching
  const { data: event, isLoading } = useQuery({
    queryKey: ["upcoming-event"],
    queryFn: getUpcomingEvent,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when user returns to tab
  });

  useEffect(() => {
    if (!event) return;

    // Update countdown every second
    const updateCountdown = () => {
      const now = Date.now();
      const eventTime = new Date(event.start_date).getTime();
      const distance = eventTime - now;

      if (distance < 0) {
        setTimeUntil("Event started!");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeUntil(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeUntil(`${hours}h ${minutes}m`);
      } else {
        setTimeUntil(`${minutes}m`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [event]);

  const handleDismiss = () => setIsDismissed(true);

  // TODO: REMOVE THIS IN NEXT RELEASE
  const ENABLE_TICKETING = process.env.NEXT_PUBLIC_ENABLE_TICKETING === "true";

  // Don't render if feature is disabled, loading, no event, dismissed, or on hidden routes
  if (
    !ENABLE_TICKETING ||
    isLoading ||
    !event ||
    isDismissed ||
    hiddenRoutes.has(pathname)
  ) {
    return null;
  }
  /////////////////////////////////////

  // Don't render if loading, no event, dismissed, or on hidden routes
  // TODO: UNCOMMENT IN NEXT RELEASE
  // if (isLoading || !event || isDismissed || hiddenRoutes.has(pathname)) {
  //   return null;
  // }

  // Calculate ticket availability
  const ticketsRemaining = event.tickets_remaining;

  // Determine ticket status
  let ticketBadge = null;
  if (event.is_sold_out) {
    ticketBadge = (
      <Badge
        variant="secondary"
        className="bg-red-500/20 text-red-200 border-red-400"
      >
        Sold Out
      </Badge>
    );
  } else if (ticketsRemaining < 25 && ticketsRemaining > 0) {
    ticketBadge = (
      <Badge
        variant="secondary"
        className="bg-yellow-500/20 text-yellow-200 border-yellow-400"
      >
        {ticketsRemaining} {ticketsRemaining === 1 ? "ticket" : "tickets"}{" "}
        remaining
      </Badge>
    );
  } else if (!event.is_sold_out) {
    ticketBadge = (
      <Badge
        variant="secondary"
        className="bg-green-500/20 text-green-200 border-green-400"
      >
        Tickets Available
      </Badge>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="sticky top-16 z-40 overflow-hidden shadow-lg"
      >
        <div className="relative bg-linear-to-r from-purple-600 via-purple-500 to-pink-600">
          {/* Shine/Glint Effect */}
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
            style={{ width: "200%", transform: "skewX(-20deg)" }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 5,
              ease: "easeInOut",
            }}
          />

          <div className="relative mx-auto px-4 sm:px-6 lg:px-12">
            {/* Dismiss Button - Top Right */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-2 z-10 text-white transition-colors hover:bg-white/20 hover:text-white"
              onClick={handleDismiss}
              aria-label="Dismiss banner"
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:py-4">
              {/* Left Section: Icon + Event Details */}
              <div className="flex flex-1 gap-3 pr-12 lg:gap-4 lg:pr-0">
                {/* Icon */}
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                  className="shrink-0"
                >
                  <Sparkles className="h-7 w-7 text-yellow-300 lg:h-8 lg:w-8" />
                </motion.div>

                {/* Event Details Container */}
                <div className="flex flex-1 flex-col gap-2">
                  {/* Title Row with Badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-white lg:text-xl">
                      {event.title}
                    </h3>
                    {ticketBadge}
                    {timeUntil && (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-500/20 text-yellow-200 border-yellow-400"
                      >
                        <Clock className="mr-1 h-3 w-3" />
                        Starts in {timeUntil}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Section: CTA Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="lg:flex-none mx-4"
              >
                {event.is_sold_out ? (
                  <Button
                    size="lg"
                    disabled
                    className="w-full bg-white font-semibold text-purple-600 shadow-lg hover:bg-white/90 hover:shadow-xl lg:min-w-[140px] disabled:opacity-50"
                  >
                    <Ticket className="h-5 w-5" />
                    <span>Sold Out</span>
                  </Button>
                ) : (
                  <Link href="/upcoming-event">
                    <Button
                      size="lg"
                      className="w-full bg-white font-semibold text-purple-600 shadow-lg hover:bg-white/90 hover:shadow-xl lg:min-w-[140px]"
                    >
                      <Ticket className="h-5 w-5" />
                      <span>Get Tickets</span>
                    </Button>
                  </Link>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
