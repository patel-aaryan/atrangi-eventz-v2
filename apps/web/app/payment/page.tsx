"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  OrderSummary,
  PaymentForm,
  ProgressIndicator,
} from "@/components/payment";
import { StripeProvider } from "@/providers/stripe-provider";
import type {
  PaymentFormData,
  StripePaymentResult,
  TicketSelection,
} from "@/types/checkout";
import { CHECKOUT_STEPS, calculateProcessingFee } from "@/constants/checkout";
import { useTicket } from "@/contexts/ticket-context";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import type {
  CompletePurchaseData,
  CompletePurchaseResult,
} from "@atrangi/types";
import { Loader2, RotateCcw } from "lucide-react";
import { Button } from "@atrangi/ui";
import { createPaymentIntent } from "@/lib/api/stripe";
import { completePurchase } from "@/lib/api/purchase";
import { useReservationTimer } from "@/hooks/use-reservation-timer";
import {
  setPaymentIntent,
  clearPaymentIntent,
  clearReservation,
} from "@/store/slices/checkoutSlice";
import { ReservationExpired } from "@/components/reservation-expired";
import { ReservationTimer } from "@/components/reservation-timer";

const RESERVATION_DURATION = 20 * 60 * 1000; // 20 minutes in milliseconds

export default function PaymentPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Use ref to prevent duplicate API calls (survives React Strict Mode double-invoke)
  const paymentIntentCreatedRef = useRef(false);

  const {
    currentEvent,
    ticketSelections,
    subtotal: contextSubtotal,
    isLoading,
  } = useTicket();
  const savedCheckoutData = useAppSelector((state) => state.checkout.formData);
  const storedPayment = useAppSelector((state) => state.checkout.paymentIntent);
  const storedReservation = useAppSelector(
    (state) => state.checkout.reservation,
  );

  // Reservation timer hook with persisted start time from when reservation was created
  const { minutes, seconds, isExpired, isWarning } = useReservationTimer({
    duration: RESERVATION_DURATION,
    startTime: storedReservation?.createdAt || null,
    onExpire: () => {
      setPaymentError(
        "Your reservation has expired. Please select tickets again.",
      );
      // Clean up stored payment and reservation data
      dispatch(clearPaymentIntent());
      dispatch(clearReservation());
      setTimeout(() => {
        router.push("/upcoming-event");
      }, 3000);
    },
    enabled: !!storedReservation?.createdAt,
  });

  // Transform ticket selections to match OrderSummary format
  const tickets: TicketSelection[] = useMemo(() => {
    if (!ticketSelections || ticketSelections.length === 0) return [];

    return ticketSelections.map((selection) => ({
      id: selection.ticketId,
      name: selection.ticketName,
      price: selection.pricePerTicket,
      quantity: selection.quantity,
    }));
  }, [ticketSelections]);

  // Format event date
  const eventDate = useMemo(() => {
    if (!currentEvent) return "";
    const startDate = new Date(currentEvent.start_date);
    const endDate = currentEvent.end_date
      ? new Date(currentEvent.end_date)
      : null;

    const dateStr = startDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const startTime = startDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (endDate) {
      const endTime = endDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      return `${dateStr} • ${startTime} - ${endTime}`;
    }

    return `${dateStr} • ${startTime}`;
  }, [currentEvent]);

  // Format event location
  const eventLocation = useMemo(() => {
    if (!currentEvent) return "";
    const parts: string[] = [];
    if (currentEvent.venue_name) parts.push(currentEvent.venue_name);
    if (currentEvent.venue_city) parts.push(currentEvent.venue_city);
    return parts.length > 0 ? parts.join(", ") : "TBA";
  }, [currentEvent]);

  // Calculate totals
  const subtotal = contextSubtotal;
  const discount = 0; // TODO: Implement promo code system
  const processingFee = calculateProcessingFee(subtotal - discount);
  const total = subtotal - discount + processingFee;

  // Create PaymentIntent when component mounts (only once)
  useEffect(() => {
    const initializePaymentIntent = async () => {
      if (!currentEvent || tickets.length === 0 || total <= 0) {
        return;
      }

      // Prevent duplicate PaymentIntent creation using ref (survives Strict Mode)
      if (paymentIntentCreatedRef.current) return;

      const amountInCents = Math.round(total * 100);

      // Check Redux for existing PaymentIntent
      if (
        storedPayment &&
        storedPayment.eventId === currentEvent.id &&
        storedPayment.amount === amountInCents &&
        Date.now() - storedPayment.createdAt < RESERVATION_DURATION
      ) {
        // Reuse existing PaymentIntent
        console.log("[Payment] Reusing existing PaymentIntent from Redux");
        setClientSecret(storedPayment.clientSecret);
        paymentIntentCreatedRef.current = true;
        return;
      }

      // Clean up invalid/expired stored data
      if (storedPayment) {
        dispatch(clearPaymentIntent());
      }

      // Mark as in-progress immediately to prevent race conditions
      paymentIntentCreatedRef.current = true;

      try {
        setPaymentError(null);
        console.log("[Payment] Creating new PaymentIntent");

        const data = await createPaymentIntent({
          amount: amountInCents,
          eventId: currentEvent.id,
          eventTitle: currentEvent.title,
          ticketSelections: ticketSelections.map((t) => ({
            ticketId: t.ticketId,
            ticketName: t.ticketName,
            quantity: t.quantity,
          })),
        });

        setClientSecret(data.clientSecret);

        // Store PaymentIntent in Redux (auto-persists to sessionStorage)
        dispatch(
          setPaymentIntent({
            clientSecret: data.clientSecret,
            paymentIntentId: data.paymentIntentId,
            createdAt: Date.now(),
            amount: amountInCents,
            eventId: currentEvent.id,
          }),
        );
      } catch (error) {
        console.error("Error creating PaymentIntent:", error);
        setPaymentError(
          error instanceof Error
            ? error.message
            : "Failed to initialize payment. Please try again.",
        );
        // Reset ref on error so user can retry
        paymentIntentCreatedRef.current = false;
      }
    };

    initializePaymentIntent();
    // Only depend on event ID and total amount (not the entire objects)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEvent?.id, total, storedPayment, dispatch]);

  // Redirect if no event or tickets selected (only after loading completes)
  useEffect(() => {
    if (!isLoading && (!currentEvent || tickets.length === 0)) {
      router.push("/upcoming-event");
    }
  }, [isLoading, currentEvent, tickets.length, router]);

  // Show loading state while data is being fetched
  if (isLoading || !currentEvent || tickets.length === 0) return null;

  // Show expiration message if reservation expired
  if (isExpired) return <ReservationExpired />;

  // Render payment content based on state
  const renderPaymentContent = () => {
    if (paymentError) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-lg bg-destructive/10 border border-destructive/20 text-center"
        >
          <p className="text-destructive font-medium mb-4">{paymentError}</p>
          <Button
            onClick={() => globalThis.location.reload()}
            variant="outline"
            size="lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Try Again
          </Button>
        </motion.div>
      );
    }

    if (clientSecret) {
      return (
        <StripeProvider clientSecret={clientSecret}>
          <PaymentForm
            onSubmit={handleFormSubmit}
            onBack={() => router.back()}
            isSubmitting={isSubmitting}
          />
        </StripeProvider>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center p-12 rounded-lg border bg-card"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Initializing secure payment...</p>
      </motion.div>
    );
  };

  const handleFormSubmit = async (
    formData: PaymentFormData,
    stripeResult: StripePaymentResult,
  ) => {
    setIsSubmitting(true);

    try {
      if (!savedCheckoutData) {
        alert(
          "We need your contact and attendee details before completing payment.",
        );
        router.push("/checkout");
        return;
      }

      // Call purchase completion API with Stripe payment details
      const payload: CompletePurchaseData = {
        eventId: currentEvent.id,
        ticketSelections: ticketSelections.map((selection) => {
          const tierIndex = Number.parseInt(
            selection.ticketId.replace("ticket-", ""),
            10,
          );

          return {
            ticketId: selection.ticketId,
            ticketName: selection.ticketName,
            tierIndex: Number.isNaN(tierIndex) ? 0 : tierIndex,
            pricePerTicket: selection.pricePerTicket,
            quantity: selection.quantity,
          };
        }),
        attendeeInfo: savedCheckoutData.attendees.map((attendee) => ({
          ticketId: attendee.ticketId,
          firstName: attendee.firstName,
          lastName: attendee.lastName,
        })),
        contactInfo: {
          firstName: savedCheckoutData.contact.firstName,
          lastName: savedCheckoutData.contact.lastName,
          email: savedCheckoutData.contact.email,
          phone: savedCheckoutData.contact.phone,
        },
        paymentInfo: {
          subtotal,
          discount,
          processingFee,
          total,
          stripePaymentIntentId: stripeResult.paymentIntentId,
          stripePaymentMethodId: stripeResult.paymentMethodId,
          stripeChargeId: stripeResult.chargeId,
          paymentStatus: stripeResult.status,
        },
        billingInfo: {
          zip: formData.billingPostalCode,
          address: formData.billingAddress,
        },
        promoCode: undefined,
      };

      let result: CompletePurchaseResult;
      try {
        result = await completePurchase(payload);
      } catch (error) {
        console.error("Purchase completion failed:", error);
        alert(
          error instanceof Error
            ? error.message
            : "We couldn't complete your purchase. Please try again.",
        );
        return;
      }

      // Clean up stored payment and reservation data after successful purchase
      dispatch(clearPaymentIntent());
      dispatch(clearReservation());

      // Navigate to confirmation page
      router.push(
        `/confirmation?orderId=${result.orderNumber || result.orderId}`,
      );
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 min-h-screen">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-highlight/10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <ProgressIndicator currentStep={3} steps={CHECKOUT_STEPS} />

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            <span className="bg-linear-to-r from-primary via-highlight to-purple-500 bg-clip-text text-transparent">
              Payment
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Complete your payment securely to receive your tickets
          </p>
        </motion.div>

        {/* Countdown Timer */}
        {storedReservation?.createdAt && !isExpired && (
          <ReservationTimer
            minutes={minutes}
            seconds={seconds}
            isWarning={isWarning}
          />
        )}

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left Column - Payment Form (2/3 width) */}
          <div className="lg:col-span-2">{renderPaymentContent()}</div>

          {/* Right Column - Order Summary (1/3 width) */}
          <div className="lg:col-span-1">
            <OrderSummary
              eventTitle={currentEvent.title}
              eventDate={eventDate}
              eventLocation={eventLocation}
              tickets={tickets}
              subtotal={subtotal}
              discount={discount}
              processingFee={processingFee}
              total={total}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
