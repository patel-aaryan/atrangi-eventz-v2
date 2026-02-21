import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { UpcomingEventItem } from "@atrangi/types";
import { reserveTicketsBatch } from "@/lib/api/tickets";
import { useAppDispatch } from "@/store/hooks";
import { setReservation } from "@/store/slices/checkoutSlice";

interface UseTicketCheckoutProps {
  currentEvent: UpcomingEventItem | null;
  setSelectedTickets: (tickets: Record<string, number>) => void;
  setIsOpen: (open: boolean) => void;
}

/**
 * Hook for handling ticket checkout flow (reservation and navigation)
 */
export function useTicketCheckout({
  currentEvent,
  setSelectedTickets,
  setIsOpen,
}: UseTicketCheckoutProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleProceedToCheckout = useCallback(
    async (selections: Record<string, number>) => {
      if (!currentEvent) return;

      try {
        // Update context state
        setSelectedTickets(selections);

        // Prepare reservations array from selections
        const reservations = Object.entries(selections)
          .filter(([, quantity]) => quantity > 0)
          .map(([ticketId, quantity]) => {
            const tierIndex = Number.parseInt(
              ticketId.replace("ticket-", ""),
              10,
            );
            return {
              tierIndex,
              quantity,
            };
          });

        // Reserve all selected tickets atomically in a single batch operation
        // This prevents race conditions when reserving multiple tickets
        if (reservations.length > 0) {
          const result = await reserveTicketsBatch({
            eventId: currentEvent.id,
            reservations,
          });

          // Store reservation timestamp in Redux for timer synchronization
          dispatch(
            setReservation({
              createdAt: result.createdAt,
              eventId: currentEvent.id,
            }),
          );
        }

        // Navigate to checkout
        router.push("/checkout");
        setIsOpen(false);
      } catch (error) {
        console.error("Failed to reserve tickets:", error);
        toast.error(
          "Failed to reserve tickets. Please try again or contact support if the problem persists.",
        );
        throw error;
      }
    },
    [currentEvent, router, setSelectedTickets, setIsOpen, dispatch],
  );

  return { handleProceedToCheckout };
}
