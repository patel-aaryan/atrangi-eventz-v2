/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback } from "react";

interface UseTicketManagementProps {
  setSelectedTickets: (
    tickets:
      | Record<string, number>
      | ((prev: Record<string, number>) => Record<string, number>)
  ) => void;
}

interface UseTicketManagementReturn {
  addTicket: (ticketId: string, quantity?: number) => void;
  removeTicket: (ticketId: string, quantity?: number) => void;
  updateTicketQuantity: (ticketId: string, quantity: number) => void;
  clearSelections: () => void;
}

/**
 * Hook for managing ticket selections (add, remove, update, clear)
 */
export function useTicketManagement({
  setSelectedTickets,
}: UseTicketManagementProps): UseTicketManagementReturn {
  const addTicket = useCallback(
    (ticketId: string, quantity: number = 1) => {
      setSelectedTickets((prev) => ({
        ...prev,
        [ticketId]: (prev[ticketId] || 0) + quantity,
      }));
    },
    [setSelectedTickets]
  );

  const removeTicket = useCallback(
    (ticketId: string, quantity: number = 1) => {
      setSelectedTickets((prev) => {
        const currentQty = prev[ticketId] || 0;
        const newQty = Math.max(0, currentQty - quantity);

        if (newQty === 0) {
          const { [ticketId]: _, ...rest } = prev;
          return rest;
        }

        return { ...prev, [ticketId]: newQty };
      });
    },
    [setSelectedTickets]
  );

  const updateTicketQuantity = useCallback(
    (ticketId: string, quantity: number) => {
      if (quantity <= 0) {
        // Remove ticket if quantity is 0 or negative
        setSelectedTickets((prev) => {
          const { [ticketId]: _, ...rest } = prev;
          return rest;
        });
      } else {
        setSelectedTickets((prev) => ({
          ...prev,
          [ticketId]: quantity,
        }));
      }
    },
    [setSelectedTickets]
  );

  const clearSelections = useCallback(() => {
    setSelectedTickets({});
  }, [setSelectedTickets]);

  return {
    addTicket,
    removeTicket,
    updateTicketQuantity,
    clearSelections,
  };
}
