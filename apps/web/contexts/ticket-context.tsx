"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { TicketSelectionDrawer } from "@/components/past-events/ticket-selection-drawer";
import type { UpcomingEventItem } from "@atrangi/types";
import { useTicketReservations } from "@/hooks/use-ticket-reservations";
import { useTicketManagement } from "@/hooks/use-ticket-management";
import { useTicketCalculations } from "@/hooks/use-ticket-calculations";
import { useTicketCheckout } from "@/hooks/use-ticket-checkout";

interface TicketSelection {
  ticketId: string;
  ticketName: string;
  quantity: number;
  pricePerTicket: number;
}

interface TicketContextType {
  // Loading state
  isLoading: boolean;

  // Drawer state
  isOpen: boolean;
  openDrawer: (event: UpcomingEventItem) => void;
  closeDrawer: () => void;

  // Current event
  currentEvent: UpcomingEventItem | null;
  setCurrentEvent: (event: UpcomingEventItem | null) => void;

  // Ticket selection state
  selectedTickets: Record<string, number>;
  setSelectedTickets: (selections: Record<string, number>) => void;

  // Ticket management helpers
  addTicket: (ticketId: string, quantity?: number) => void;
  removeTicket: (ticketId: string, quantity?: number) => void;
  updateTicketQuantity: (ticketId: string, quantity: number) => void;
  clearSelections: () => void;

  // Computed values
  totalTickets: number;
  subtotal: number;
  ticketSelections: TicketSelection[]; // Formatted selections with details
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

interface TicketProviderProps {
  readonly children: ReactNode;
}

export function TicketProvider({ children }: TicketProviderProps) {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<UpcomingEventItem | null>(
    null
  );
  const [selectedTickets, setSelectedTickets] = useState<
    Record<string, number>
  >({});

  // Fetch and sync reservations from cache
  const { isLoading } = useTicketReservations({
    currentEvent,
    setCurrentEvent,
    setSelectedTickets,
  });

  // Ticket management helpers
  const { addTicket, removeTicket, updateTicketQuantity, clearSelections } =
    useTicketManagement({
      setSelectedTickets,
    });

  // Computed values
  const { totalTickets, subtotal, ticketSelections, ticketTypes } =
    useTicketCalculations({
      selectedTickets,
      currentEvent,
    });

  // Checkout handler
  const { handleProceedToCheckout } = useTicketCheckout({
    currentEvent,
    setSelectedTickets,
    setIsOpen,
  });

  // Drawer controls
  const openDrawer = useCallback((event: UpcomingEventItem) => {
    setCurrentEvent(event);
    setIsOpen(true);
  }, []);

  const closeDrawer = useCallback(() => setIsOpen(false), []);

  // Format event date
  const formattedEventDate = useMemo(() => {
    if (!currentEvent) return "";
    const eventDate = new Date(currentEvent.start_date);
    return eventDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [currentEvent]);

  const value = useMemo(
    () => ({
      // Loading state
      isLoading,

      // Drawer state
      isOpen,
      openDrawer,
      closeDrawer,

      // Current event
      currentEvent,
      setCurrentEvent,

      // Ticket selection state
      selectedTickets,
      setSelectedTickets,

      // Ticket management helpers
      addTicket,
      removeTicket,
      updateTicketQuantity,
      clearSelections,

      // Computed values
      totalTickets,
      subtotal,
      ticketSelections,
    }),
    [
      isLoading,
      isOpen,
      openDrawer,
      closeDrawer,
      currentEvent,
      selectedTickets,
      addTicket,
      removeTicket,
      updateTicketQuantity,
      clearSelections,
      totalTickets,
      subtotal,
      ticketSelections,
    ]
  );

  return (
    <TicketContext.Provider value={value}>
      {children}
      {currentEvent && (
        <TicketSelectionDrawer
          open={isOpen}
          onOpenChange={setIsOpen}
          eventTitle={currentEvent.title}
          eventDate={formattedEventDate}
          eventLocation={
            currentEvent.venue_name || currentEvent.venue_city || "TBA"
          }
          ticketTypes={ticketTypes}
          onProceedToCheckout={handleProceedToCheckout}
        />
      )}
    </TicketContext.Provider>
  );
}

export function useTicket() {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error("useTicket must be used within TicketProvider");
  }
  return context;
}
