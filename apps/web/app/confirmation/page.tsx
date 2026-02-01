"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@atrangi/ui";
import { ProgressIndicator } from "@/components/payment";
import {
  SuccessHeader,
  OrderHeader,
  EventDetailsCard,
  PaymentSummaryCard,
  QRCodeCard,
} from "@/components/confirmation";
import { CHECKOUT_STEPS, calculateProcessingFee } from "@/constants/checkout";
import { useTicket } from "@/contexts/ticket-context";
import { useAppSelector } from "@/store/hooks";
import { Download, Home } from "lucide-react";
import confetti from "canvas-confetti";

interface ConfirmationOrder {
  orderId: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  contactEmail: string;
  tickets: Array<{ id: string; name: string; quantity: number; price: number }>;
  subtotal: number;
  discount: number;
  processingFee: number;
  total: number;
  promoCode?: string;
}

function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showContent, setShowContent] = useState(false);

  const orderIdFromUrl = searchParams.get("orderId") ?? "Unknown";

  const {
    currentEvent,
    ticketSelections,
    subtotal: contextSubtotal,
  } = useTicket();
  const savedCheckoutData = useAppSelector((state) => state.checkout.formData);

  // If user lands here without an event or tickets, send them back to events
  useEffect(() => {
    if (!currentEvent || ticketSelections.length === 0) {
      router.push("/upcoming-event");
    }
  }, [currentEvent, ticketSelections.length, router]);

  const subtotal = contextSubtotal;
  const discount = 0;
  const processingFee = calculateProcessingFee(subtotal - discount);
  const total = subtotal - discount + processingFee;

  const eventDateTime = useMemo(() => {
    if (!currentEvent) {
      return { eventDate: "", eventTime: "" };
    }

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

    let timeStr = startTime;
    if (endDate) {
      const endTime = endDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      timeStr = `${startTime} - ${endTime}`;
    }

    return {
      eventDate: dateStr,
      eventTime: timeStr,
    };
  }, [currentEvent]);

  const eventLocation = useMemo(() => {
    if (!currentEvent) return "TBA";
    const parts: string[] = [];
    if (currentEvent.venue_name) parts.push(currentEvent.venue_name);
    if (currentEvent.venue_city) parts.push(currentEvent.venue_city);
    return parts.length > 0 ? parts.join(", ") : "TBA";
  }, [currentEvent]);

  const confirmationOrder: ConfirmationOrder = {
    orderId: orderIdFromUrl,
    eventName: currentEvent?.title ?? "Your Event",
    eventDate: eventDateTime.eventDate,
    eventTime: eventDateTime.eventTime,
    eventLocation,
    contactEmail: savedCheckoutData?.contact.email ?? "",
    tickets: ticketSelections.map((selection) => ({
      id: selection.ticketId,
      name: selection.ticketName,
      quantity: selection.quantity,
      price: selection.pricePerTicket,
    })),
    subtotal,
    discount,
    processingFee,
    total,
    promoCode: undefined,
  };

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        setShowContent(true);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2,
        },
        colors: ["#ec4899", "#8b5cf6", "#06b6d4"],
      });
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2,
        },
        colors: ["#ec4899", "#8b5cf6", "#06b6d4"],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handleDownloadTickets = () => {
    // TODO: Implement actual ticket download
    console.log("Downloading tickets...");
  };

  const handleShareEvent = () => {
    // TODO: Implement social sharing
    if (navigator.share) {
      navigator
        .share({
          title: confirmationOrder.eventName,
          text: `I'm attending ${confirmationOrder.eventName}!`,
          url: globalThis.location.origin + "/upcoming-event",
        })
        .catch(console.error);
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 min-h-screen">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-highlight/10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <ProgressIndicator currentStep={4} steps={CHECKOUT_STEPS} />

        {/* Success Header */}
        <SuccessHeader contactEmail={confirmationOrder.contactEmail} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6 lg:items-start">
            {/* Left Column - Order Number & Event Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: showContent ? 1 : 0,
                x: showContent ? 0 : -20,
              }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col gap-6 h-full"
            >
              <OrderHeader
                orderId={confirmationOrder.orderId}
                onDownload={handleDownloadTickets}
                onShare={handleShareEvent}
              />

              <EventDetailsCard
                eventName={confirmationOrder.eventName}
                eventDate={confirmationOrder.eventDate}
                eventTime={confirmationOrder.eventTime}
                eventLocation={confirmationOrder.eventLocation}
                tickets={confirmationOrder.tickets}
              />
            </motion.div>

            {/* Right Column - Payment Summary & QR Code */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{
                opacity: showContent ? 1 : 0,
                x: showContent ? 0 : 20,
              }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col gap-6 h-full"
            >
              <PaymentSummaryCard
                subtotal={confirmationOrder.subtotal}
                discount={confirmationOrder.discount}
                processingFee={confirmationOrder.processingFee}
                total={confirmationOrder.total}
                promoCode={confirmationOrder.promoCode}
              />

              <QRCodeCard
                contactEmail={confirmationOrder.contactEmail}
                qrCodeValue={confirmationOrder.orderId}
              />
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/upcoming-event")}
              className="flex-1"
            >
              <Home className="w-5 h-5 mr-2" />
              Browse More Events
            </Button>
            <Button
              size="lg"
              onClick={handleDownloadTickets}
              className="flex-1 bg-linear-to-r from-primary to-highlight hover:opacity-90"
            >
              <Download className="w-5 h-5 mr-2" />
              Download All Tickets
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <section className="relative overflow-hidden pt-8 pb-16 min-h-screen">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-highlight/10" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <p className="text-muted-foreground text-lg">
              Loading your confirmation...
            </p>
          </div>
        </section>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
