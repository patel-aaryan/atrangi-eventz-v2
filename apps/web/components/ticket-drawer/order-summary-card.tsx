"use client";

import { motion } from "framer-motion";
import { Card, Separator } from "@atrangi/ui";
import { Receipt } from "lucide-react";
import type { TicketType } from "@/types/checkout";

interface OrderSummaryCardProps {
  quantities: Record<string, number>;
  ticketTypes: TicketType[];
  total: number;
  totalTickets: number;
}

export function OrderSummaryCard({
  quantities,
  ticketTypes,
  total,
  totalTickets,
}: Readonly<OrderSummaryCardProps>) {
  const hasSelections = Object.entries(quantities).length > 0;

  return (
    <div className="hidden lg:flex lg:flex-col space-y-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <Receipt className="w-5 h-5" />
        Order Summary
      </h3>

      <Card className="px-6 py-8 space-y-4 flex-1 flex flex-col h-full">
        {hasSelections ? (
          <div className="space-y-3 flex-1 flex flex-col">
            <div className="space-y-3">
              {Object.entries(quantities).map(([ticketId, qty]) => {
                const ticket = ticketTypes.find((t) => t.id === ticketId);
                if (!ticket) return null;

                return (
                  <div key={ticketId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {ticket.name} × {qty}
                    </span>
                    <span className="font-medium">
                      ${(ticket.price * qty).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-auto space-y-3">
              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground text-center pt-2"
              >
                {totalTickets} {totalTickets === 1 ? "ticket" : "tickets"}{" "}
                selected
              </motion.p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p className="text-sm">No tickets selected</p>
          </div>
        )}
      </Card>
    </div>
  );
}
