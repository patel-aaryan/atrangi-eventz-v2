"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Button,
} from "@atrangi/ui";
import {
  TicketList,
  OrderSummaryCard,
  MobileSummary,
} from "@/components/ticket-drawer";
import type { TicketType } from "@/types/checkout";
import { ShieldCheck } from "lucide-react";

interface TicketSelectionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  ticketTypes: TicketType[];
  onProceedToCheckout: (selections: Record<string, number>) => void;
}

export function TicketSelectionDrawer({
  open,
  onOpenChange,
  eventTitle,
  eventDate,
  eventLocation,
  ticketTypes,
  onProceedToCheckout,
}: Readonly<TicketSelectionDrawerProps>) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const updateQuantity = (ticketId: string, delta: number) => {
    setQuantities((prev) => {
      const currentQty = prev[ticketId] || 0;
      const ticket = ticketTypes.find((t) => t.id === ticketId);
      if (!ticket) return prev;

      const newQty = Math.max(
        0,
        Math.min(currentQty + delta, ticket.maxQuantity, ticket.available),
      );

      if (newQty === 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [ticketId]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [ticketId]: newQty };
    });
  };

  const calculateTotal = () => {
    return Object.entries(quantities).reduce((total, [ticketId, qty]) => {
      const ticket = ticketTypes.find((t) => t.id === ticketId);
      return total + (ticket?.price || 0) * qty;
    }, 0);
  };

  const getTotalTickets = () => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  };

  const handleProceed = () => onProceedToCheckout(quantities);

  const hasSelections = getTotalTickets() > 0;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="overflow-y-auto">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-2xl font-bold">
              {eventTitle}
            </DrawerTitle>
            <DrawerDescription className="text-base">
              {eventDate} • {eventLocation}
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4">
            {/* Two column layout on desktop, single column on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-stretch">
              {/* Left Column - Ticket Types */}
              <TicketList
                ticketTypes={ticketTypes}
                quantities={quantities}
                onQuantityChange={updateQuantity}
              />

              {/* Right Column - Order Summary (desktop only) */}
              <OrderSummaryCard
                quantities={quantities}
                ticketTypes={ticketTypes}
                total={calculateTotal()}
                totalTickets={getTotalTickets()}
              />

              {/* Mobile - Original Simple Summary */}
              <MobileSummary total={calculateTotal()} />
            </div>

            {/* Trust Signals - Below everything */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-6">
              <ShieldCheck className="w-4 h-4" />
              <span>Secure checkout powered by Stripe</span>
            </div>
          </div>
        </div>

        <DrawerFooter className="pt-4 border-t">
          <Button
            size="lg"
            onClick={handleProceed}
            disabled={!hasSelections}
            className="w-full bg-linear-to-r from-primary to-highlight hover:opacity-90"
          >
            {hasSelections
              ? `Proceed to Checkout • $${calculateTotal().toFixed(2)}`
              : "Select tickets to continue"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" size="lg" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
