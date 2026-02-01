"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ScrollArea,
} from "@atrangi/ui";
import { ProgressIndicator } from "@/components/payment";
import {
  ContactForm,
  AttendeeCard,
  EmptyCartState,
  CheckoutLoadingSkeleton,
} from "@/components/checkout";
import { CHECKOUT_STEPS } from "@/constants/checkout";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTicket } from "@/contexts/ticket-context";
import {
  checkoutFormSchema,
  type CheckoutFormInput,
} from "@/lib/validation/checkout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setCheckoutData,
  clearReservation,
} from "@/store/slices/checkoutSlice";
import { useReservationTimer } from "@/hooks/use-reservation-timer";
import { ReservationTimer } from "@/components/reservation-timer";
import { ReservationExpired } from "@/components/reservation-expired";

const RESERVATION_DURATION = 10 * 60 * 1000; // 20 minutes in milliseconds

export default function CheckoutPage() {
  const router = useRouter();
  const { ticketSelections, isLoading } = useTicket();
  const dispatch = useAppDispatch();
  const savedCheckoutData = useAppSelector((state) => state.checkout.formData);
  const storedReservation = useAppSelector(
    (state) => state.checkout.reservation
  );

  // Reservation timer hook with persisted start time from when reservation was created
  const { minutes, seconds, isExpired, isWarning } = useReservationTimer({
    duration: RESERVATION_DURATION,
    startTime: storedReservation?.createdAt || null,
    onExpire: () => {
      // Clean up reservation data
      dispatch(clearReservation());
      // Redirect handled by ReservationExpired component or after delay
      setTimeout(() => {
        router.push("/upcoming-event");
      }, 3000);
    },
    enabled: !!storedReservation?.createdAt,
  });

  const form = useForm<CheckoutFormInput>({
    resolver: zodResolver(checkoutFormSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      contact: savedCheckoutData?.contact || {
        firstName: "",
        lastName: "",
        email: "",
        confirmEmail: "",
        phone: "",
      },
      attendees: [],
    },
  });

  // Watch form values to trigger validation
  const watchedValues = form.watch();

  // Check if form is valid
  const isFormValid = useMemo(() => {
    const result = checkoutFormSchema.safeParse(watchedValues);
    return result.success;
  }, [watchedValues]);

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "attendees",
  });

  // Generate attendees from ticket selections and merge with saved data
  useEffect(() => {
    const newAttendees: CheckoutFormInput["attendees"] = [];

    if (!ticketSelections || ticketSelections.length === 0) {
      replace(newAttendees);
      form.reset({
        contact: savedCheckoutData?.contact || form.getValues("contact"),
        attendees: newAttendees,
      });
      return;
    }

    for (const selection of ticketSelections) {
      for (let i = 0; i < selection.quantity; i++) {
        const ticketId = `${selection.ticketId}-${i}`;
        // Try to find saved data for this attendee
        const savedAttendee = savedCheckoutData?.attendees?.find(
          (a) => a.ticketId === ticketId
        );

        newAttendees.push({
          ticketId,
          ticketName: selection.ticketName,
          firstName: savedAttendee?.firstName || "",
          lastName: savedAttendee?.lastName || "",
        });
      }
    }

    replace(newAttendees);

    // Reset form with saved contact data and merged attendees
    form.reset({
      contact: savedCheckoutData?.contact || form.getValues("contact"),
      attendees: newAttendees,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketSelections, replace]); // savedCheckoutData is stable from Redux, form.reset is stable

  const handleContinue = form.handleSubmit((data) => {
    // Store attendee info in Redux (which persists to session storage)
    dispatch(setCheckoutData(data));
    router.push("/payment");
  });

  const handleBack = () => router.back();

  // Check if there are no ticket selections
  const hasNoTickets =
    !ticketSelections || ticketSelections.length === 0 || fields.length === 0;

  // Show expiration message if reservation expired
  if (isExpired) return <ReservationExpired />;

  // Loading skeleton while fetching reservations
  if (isLoading) return <CheckoutLoadingSkeleton />;

  // Empty state UI - only show when we're sure there are no tickets
  if (hasNoTickets) return <EmptyCartState onBrowseEvents={handleBack} />;

  return (
    <section className="relative overflow-hidden pt-8 pb-16 min-h-screen">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-highlight/10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <ProgressIndicator currentStep={2} steps={CHECKOUT_STEPS} />

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            <span className="bg-linear-to-r from-primary via-highlight to-purple-500 bg-clip-text text-transparent">
              Attendee Information
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Tell us who&apos;s attending
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
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column - Attendee Details in Scrollable Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Attendee Details ({fields.length}{" "}
                  {fields.length === 1 ? "Ticket" : "Tickets"})
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full px-6 pb-6">
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <AttendeeCard
                        key={field.id}
                        index={index}
                        ticketId={field.ticketId}
                        ticketName={field.ticketName}
                        register={form.register}
                        errors={form.formState.errors.attendees?.[index]}
                        touchedFields={
                          form.formState.touchedFields.attendees?.[index]
                        }
                        isSubmitted={form.formState.isSubmitted}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[600px]"
          >
            <ContactForm
              register={form.register}
              errors={form.formState.errors.contact}
              touchedFields={form.formState.touchedFields.contact}
              isSubmitted={form.formState.isSubmitted}
            />
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-4"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={handleBack}
            className="flex-1"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Tickets
          </Button>
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!isFormValid}
            className="flex-1 bg-linear-to-r from-primary to-highlight hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Payment
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
