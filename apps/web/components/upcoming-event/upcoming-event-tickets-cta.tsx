"use client";

import { motion } from "framer-motion";
import { Ticket } from "lucide-react";
import { Button, Badge } from "@atrangi/ui";
import { useTicket } from "@/contexts/ticket-context";
import type { UpcomingEventItem } from "@atrangi/types";

interface UpcomingEventTicketsCTAProps {
  readonly event: UpcomingEventItem;
}

export function UpcomingEventTicketsCTA({
  event,
}: UpcomingEventTicketsCTAProps) {
  const { openDrawer } = useTicket();

  // Calculate if tickets are on sale
  const now = new Date();
  const salesOpen = event.ticket_sales_open
    ? new Date(event.ticket_sales_open)
    : null;
  const salesClose = event.ticket_sales_close
    ? new Date(event.ticket_sales_close)
    : null;

  const ticketsOnSale =
    (!salesOpen || now >= salesOpen) &&
    (!salesClose || now <= salesClose) &&
    !event.is_sold_out;

  return (
    <motion.section
      id="tickets"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center py-8"
    >
      {event.is_sold_out && (
        <div className="space-y-4">
          <Badge variant="destructive" className="text-lg px-6 py-2">
            Event Sold Out
          </Badge>
          <p className="text-muted-foreground">
            This event has reached full capacity
          </p>
        </div>
      )}
      {!event.is_sold_out && ticketsOnSale && (
        <div className="space-y-4">
          <Button
            size="lg"
            onClick={() => openDrawer(event)}
            className="px-12 py-7 text-xl bg-linear-to-r from-primary to-highlight hover:opacity-90 shadow-lg hover:shadow-xl transition-all"
          >
            <Ticket className="mr-3 h-6 w-6" />
            Get Tickets Now
          </Button>
          {event.tickets_remaining < 50 && (
            <Badge
              variant="outline"
              className="border-yellow-500 text-yellow-500 text-sm"
            >
              Only {event.tickets_remaining} tickets remaining!
            </Badge>
          )}
        </div>
      )}
      {!event.is_sold_out && !ticketsOnSale && (
        <div className="space-y-4">
          <Button size="lg" disabled className="px-12 py-7 text-xl">
            <Ticket className="mr-3 h-6 w-6" />
            Tickets Coming Soon
          </Button>
          {salesOpen && (
            <p className="text-sm text-muted-foreground">
              Ticket sales open on{" "}
              {salesOpen.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      )}
    </motion.section>
  );
}
