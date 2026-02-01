"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Clock } from "lucide-react";
import {
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@atrangi/ui";
import { getUpcomingEvent } from "@/lib/api/events";
import { getReservations } from "@/lib/api/tickets";
import { NavEmptyCartState } from "./nav-empty-cart-state";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { useReservationTimer } from "@/hooks/use-reservation-timer";

interface CartItem {
  tierIndex: number;
  tierName: string;
  quantity: number;
  price: number;
}

const RESERVATION_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
const REFRESH_INTERVAL = 30 * 1000; // Refresh every 30 seconds

export function ShoppingCartDropdown() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get reservation data from Redux store
  const storedReservation = useAppSelector(
    (state) => state.checkout.reservation
  );

  const loadCartData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch upcoming event
      const upcomingEvent = await getUpcomingEvent();

      if (!upcomingEvent) {
        setCartItems([]);
        return;
      }

      // Fetch reservations for this event
      // Redis TTL should automatically filter out expired reservations,
      // but we refresh periodically to ensure we have the latest data
      const reservations = await getReservations(upcomingEvent.id);

      // Map reservations to cart items with full details
      // Only include reservations that exist (Redis TTL handles expiration)
      const items: CartItem[] = reservations
        .map((reservation) => {
          const tier = upcomingEvent.ticket_tiers[reservation.tierIndex];
          return {
            tierIndex: reservation.tierIndex,
            tierName: tier?.name || `Tier ${reservation.tierIndex + 1}`,
            quantity: reservation.quantity,
            price: tier?.price || 0,
          };
        })
        .filter((item) => item.quantity > 0); // Additional safety check

      setCartItems(items);
    } catch (error) {
      console.error("Error loading cart data:", error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reservation timer hook with persisted start time from when reservation was created
  const { minutes, seconds, isExpired, isWarning } = useReservationTimer({
    duration: RESERVATION_DURATION,
    startTime: storedReservation?.createdAt || null,
    onExpire: () => {
      // Refresh cart data when reservation expires
      loadCartData();
    },
    enabled: !!storedReservation?.createdAt && cartItems.length > 0,
  });

  useEffect(() => {
    loadCartData();

    // Set up periodic refresh to ensure expired reservations are removed
    refreshIntervalRef.current = setInterval(() => {
      loadCartData();
    }, REFRESH_INTERVAL);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [loadCartData]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleOpenChange = (open: boolean) => {
    // Refresh cart data when hover card opens to ensure we have latest reservations
    if (open) {
      loadCartData();
    }
  };

  return (
    <HoverCard openDelay={200} closeDelay={300} onOpenChange={handleOpenChange}>
      <HoverCardTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Shopping cart"
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full text-xs font-medium text-white bg-linear-to-r from-primary to-highlight shadow-sm">
              {totalItems}
            </span>
          )}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-[400px] p-0" align="end">
        <div className="flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b">
            <h3 className="font-semibold text-lg">Shopping Cart</h3>
            {cartItems.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {totalItems} {totalItems === 1 ? "ticket" : "tickets"} reserved
              </p>
            )}
          </div>

          {/* Cart Content */}
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading && (
              <div className="p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            )}
            {!isLoading && cartItems.length === 0 && <NavEmptyCartState />}
            {!isLoading && cartItems.length > 0 && (
              <div className="p-4 space-y-3">
                {/* Reservation Timer Notice */}
                {storedReservation?.createdAt && !isExpired ? (
                  <div
                    className={`flex items-start gap-2 p-3 rounded-lg border ${isWarning
                      ? "bg-destructive/10 border-destructive/30"
                      : "bg-primary/5 border-primary/20"
                      }`}
                  >
                    <Clock
                      className={`h-4 w-4 mt-0.5 shrink-0 ${isWarning
                        ? "text-destructive animate-pulse"
                        : "text-primary"
                        }`}
                    />
                    <div className="flex-1">
                      <p
                        className={`text-xs ${isWarning ? "text-destructive" : "text-foreground"
                          }`}
                      >
                        {isWarning ? (
                          <>
                            ⚠️ Time remaining:{" "}
                            <span className="font-bold tabular-nums">
                              {minutes}:{String(seconds).padStart(2, "0")}
                            </span>{" "}
                            . Complete checkout to secure your tickets.
                          </>
                        ) : (
                          <>
                            Time remaining:{" "}
                            <span className="font-bold tabular-nums">
                              {minutes}:{String(seconds).padStart(2, "0")}
                            </span>{" "}
                            . Complete checkout to secure them.
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                    <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-800 dark:text-amber-200">
                      Your tickets are reserved for 10 minutes. Complete
                      checkout to secure them.
                    </p>
                  </div>
                )}

                {/* Cart Items */}
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.tierIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.tierName}</h4>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-4 space-y-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <Button
                asChild
                className="w-full bg-linear-to-r from-primary to-highlight hover:opacity-90"
              >
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
