"use client";

import { useState } from "react";
import type { ComponentProps } from "react";
import { motion } from "framer-motion";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Input,
  Checkbox,
  Button,
  Separator,
} from "@atrangi/ui";
import {
  CreditCard,
  Lock,
  ShieldCheck,
  ChevronLeft,
  MapPin,
} from "lucide-react";
import type { PaymentFormData, StripePaymentResult } from "@/types/checkout";

interface PaymentFormProps {
  onSubmit: (
    formData: PaymentFormData,
    stripeResult: StripePaymentResult,
  ) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function PaymentForm({
  onSubmit,
  onBack,
  isSubmitting = false,
}: Readonly<PaymentFormProps>) {
  const stripe = useStripe();
  const elements = useElements();

  const [formData, setFormData] = useState<PaymentFormData>({
    billingPostalCode: "",
    billingAddress: "",
    agreeToTerms: false,
    subscribeToNewsletter: false,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof PaymentFormData | "stripe", string>>
  >({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (
    field: keyof PaymentFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PaymentFormData | "stripe", string>> =
      {};

    if (!formData.billingPostalCode.trim()) {
      newErrors.billingPostalCode = "Postal code is required";
    }

    if (!formData.billingAddress.trim()) {
      newErrors.billingAddress = "Billing address is required";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: Parameters<NonNullable<ComponentProps<"form">["onSubmit"]>>[0],
  ) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!stripe || !elements) {
      setErrors((prev) => ({
        ...prev,
        stripe: "Payment system is not ready. Please try again.",
      }));
      return;
    }

    setIsProcessing(true);
    setErrors({});

    try {
      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Return URL is required but we'll handle success in the redirect
          return_url: `${window.location.origin}/confirmation`,
        },
        redirect: "if_required",
      });

      if (error) {
        // Show error to customer
        setErrors((prev) => ({
          ...prev,
          stripe:
            error.message || "An error occurred while processing your payment.",
        }));
        setIsProcessing(false);
        return;
      }

      // Payment succeeded without redirect (most card payments)
      if (paymentIntent?.status === "succeeded") {
        // `latest_charge` is not always present on the Stripe.js PaymentIntent type.
        // We defensively extract it if it exists, and the server will also backfill
        // charge ID from the PaymentIntent as a reliable source of truth.
        const latestCharge = (
          paymentIntent as unknown as { latest_charge?: unknown }
        ).latest_charge;
        let chargeId: string | undefined;
        if (typeof latestCharge === "string") {
          chargeId = latestCharge;
        } else if (
          latestCharge &&
          typeof latestCharge === "object" &&
          "id" in latestCharge
        ) {
          chargeId = (latestCharge as { id: string }).id;
        }

        const stripeResult: StripePaymentResult = {
          paymentIntentId: paymentIntent.id,
          paymentMethodId:
            typeof paymentIntent.payment_method === "string"
              ? paymentIntent.payment_method
              : paymentIntent.payment_method?.id,
          chargeId,
          status: paymentIntent.status,
        };

        onSubmit(formData, stripeResult);
      } else if (paymentIntent?.status === "requires_action") {
        // 3D Secure or other action required - Stripe will handle the redirect
        setErrors((prev) => ({
          ...prev,
          stripe:
            "Additional authentication required. Please complete the verification.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          stripe: "Payment was not completed. Please try again.",
        }));
      }
    } catch (err) {
      console.error("Payment error:", err);
      setErrors((prev) => ({
        ...prev,
        stripe: "An unexpected error occurred. Please try again.",
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  const isLoading = isSubmitting || isProcessing || !stripe || !elements;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Information
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your payment details to complete your purchase
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stripe Payment Element */}
          <div className="space-y-2">
            <PaymentElement options={{ layout: "tabs" }} />
          </div>

          {/* Billing Information */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="w-4 h-4" />
              <span>Billing Information</span>
            </div>

            <div className="space-y-4">
              {/* Billing Address */}
              <div className="space-y-2">
                <Label htmlFor="billingAddress">
                  Billing Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="billingAddress"
                  type="text"
                  placeholder="123 Main Street, City, Province"
                  value={formData.billingAddress}
                  onChange={(e) =>
                    handleInputChange("billingAddress", e.target.value)
                  }
                  className={errors.billingAddress ? "border-destructive" : ""}
                  disabled={isLoading}
                />
                {errors.billingAddress && (
                  <p className="text-sm text-destructive">
                    {errors.billingAddress}
                  </p>
                )}
              </div>

              {/* Postal Code */}
              <div className="space-y-2">
                <Label htmlFor="billingPostalCode">
                  Postal Code <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="billingPostalCode"
                  type="text"
                  placeholder="A1A 1A1"
                  value={formData.billingPostalCode}
                  onChange={(e) =>
                    handleInputChange("billingPostalCode", e.target.value)
                  }
                  className={
                    errors.billingPostalCode ? "border-destructive" : ""
                  }
                  disabled={isLoading}
                />
                {errors.billingPostalCode && (
                  <p className="text-sm text-destructive">
                    {errors.billingPostalCode}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Stripe Error Message */}
          {errors.stripe && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{errors.stripe}</p>
            </div>
          )}

          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>Your payment information is encrypted and secure</span>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  handleInputChange("agreeToTerms", checked as boolean)
                }
                className={errors.agreeToTerms ? "border-destructive" : ""}
              />
              <Label
                htmlFor="terms"
                className="text-sm font-normal cursor-pointer leading-relaxed"
              >
                I agree to the{" "}
                <a href="/terms" className="text-primary hover:underline">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a
                  href="/refund-policy"
                  className="text-primary hover:underline"
                >
                  Refund Policy
                </a>
                <span className="text-destructive"> *</span>
              </Label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm text-destructive ml-6">
                {errors.agreeToTerms}
              </p>
            )}
          </div>

          <Separator />

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onBack}
              className="flex-1"
              disabled={isLoading}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back to Attendee Info
            </Button>

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="flex-1 bg-linear-to-r from-primary to-highlight hover:opacity-90"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Complete Purchase
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            By completing this purchase, you agree to receive tickets via email
            and SMS
          </p>
        </CardContent>
      </Card>
    </motion.form>
  );
}
