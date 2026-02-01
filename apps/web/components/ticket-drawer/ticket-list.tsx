"use client";

import { Ticket } from "lucide-react";
import type { TicketType } from "@/types/checkout";
import { TicketCard } from "./ticket-card";

interface TicketSelectionListProps {
  ticketTypes: TicketType[];
  quantities: Record<string, number>;
  onQuantityChange: (ticketId: string, delta: number) => void;
}

export function TicketList({
  ticketTypes,
  quantities,
  onQuantityChange,
}: Readonly<TicketSelectionListProps>) {
  return (
    <div className="space-y-4 flex flex-col">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <Ticket className="w-5 h-5" />
        Select Tickets
      </h3>

      <div className="space-y-4 flex-1">
        {ticketTypes.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            quantity={quantities[ticket.id] || 0}
            onQuantityChange={onQuantityChange}
          />
        ))}
      </div>
    </div>
  );
}
