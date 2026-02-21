"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  Badge,
} from "@atrangi/ui";
import { Calendar, MapPin, Ticket, Tag } from "lucide-react";
import type { TicketSelection } from "@/types/checkout";
import { TRUST_SIGNALS } from "@/constants/checkout";

interface OrderSummaryProps {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  tickets: TicketSelection[];
  subtotal: number;
  discount: number;
  processingFee: number;
  total: number;
  promoCode?: string;
}

export function OrderSummary({
  eventTitle,
  eventDate,
  eventLocation,
  tickets,
  subtotal,
  discount,
  processingFee,
  total,
  promoCode,
}: Readonly<OrderSummaryProps>) {
  const totalTickets = tickets.reduce(
    (sum, ticket) => sum + ticket.quantity,
    0,
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="lg:sticky lg:top-24"
    >
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Event Details */}
          <div className="space-y-3 p-4 rounded-lg bg-muted/50">
            <h3 className="font-semibold text-lg">{eventTitle}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{eventDate}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{eventLocation}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Ticket Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Ticket className="w-4 h-4" />
              <span>Tickets ({totalTickets})</span>
            </div>

            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex justify-between items-start text-sm"
              >
                <div className="flex-1">
                  <p className="font-medium">{ticket.name}</p>
                  <p className="text-muted-foreground text-xs">
                    Qty: {ticket.quantity} × ${ticket.price.toFixed(2)}
                  </p>
                </div>
                <span className="font-semibold">
                  ${(ticket.price * ticket.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between text-sm items-center"
              >
                <div className="flex items-center gap-2">
                  <span className="text-green-600 dark:text-green-400">
                    Discount
                  </span>
                  {promoCode && (
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30 text-xs"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {promoCode}
                    </Badge>
                  )}
                </div>
                <span className="font-medium text-green-600 dark:text-green-400">
                  -${discount.toFixed(2)}
                </span>
              </motion.div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Processing Fee</span>
              <span className="font-medium">${processingFee.toFixed(2)}</span>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="pt-4 space-y-2">
            {TRUST_SIGNALS.map((signal, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>{signal.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
