import { useMemo } from "react";
import type { UpcomingEventItem } from "@atrangi/types";
import { transformTicketTier } from "@/lib/utils/tickets";

interface TicketSelection {
  ticketId: string;
  ticketName: string;
  quantity: number;
  pricePerTicket: number;
}

interface UseTicketCalculationsProps {
  selectedTickets: Record<string, number>;
  currentEvent: UpcomingEventItem | null;
}

interface UseTicketCalculationsReturn {
  totalTickets: number;
  subtotal: number;
  ticketSelections: TicketSelection[];
  ticketTypes: ReturnType<typeof transformTicketTier>[];
}

/**
 * Hook for computing ticket-related values (totals, selections, types)
 */
export function useTicketCalculations({
  selectedTickets,
  currentEvent,
}: UseTicketCalculationsProps): UseTicketCalculationsReturn {
  // Transform ticket tiers for the drawer
  const ticketTypes = useMemo(() => {
    if (!currentEvent?.ticket_tiers) return [];
    return currentEvent.ticket_tiers.map((tier, index) =>
      transformTicketTier(tier, index)
    );
  }, [currentEvent]);

  // Total number of tickets selected
  const totalTickets = useMemo(() => {
    return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
  }, [selectedTickets]);

  // Formatted selections with details
  const ticketSelections = useMemo((): TicketSelection[] => {
    if (!currentEvent?.ticket_tiers) return [];

    return Object.entries(selectedTickets)
      .map(([ticketId, quantity]) => {
        const index = Number.parseInt(ticketId.replace("ticket-", ""));
        const tier = currentEvent.ticket_tiers[index];

        if (!tier) return null;

        return {
          ticketId,
          ticketName: tier.name,
          quantity,
          pricePerTicket: tier.price,
        };
      })
      .filter((item): item is TicketSelection => item !== null);
  }, [selectedTickets, currentEvent]);

  // Calculate subtotal
  const subtotal = useMemo(() => {
    return ticketSelections.reduce(
      (sum, selection) => sum + selection.quantity * selection.pricePerTicket,
      0
    );
  }, [ticketSelections]);

  return {
    totalTickets,
    subtotal,
    ticketSelections,
    ticketTypes,
  };
}

