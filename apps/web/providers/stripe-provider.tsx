"use client";

import { ReactNode } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions } from "@stripe/stripe-js";
import { useTheme } from "next-themes";
import {
  getStripe,
  stripeElementsAppearance,
  stripeElementsAppearanceDark,
} from "@/lib/stripe";

interface StripeProviderProps {
  readonly children: ReactNode;
  readonly clientSecret: string;
}

/**
 * Stripe Elements Provider
 * Wraps children with the Stripe Elements context
 * Must be rendered only when clientSecret is available
 */
export function StripeProvider({
  children,
  clientSecret,
}: StripeProviderProps) {
  const { resolvedTheme } = useTheme();

  const appearance =
    resolvedTheme === "light"
      ? stripeElementsAppearance
      : stripeElementsAppearanceDark;

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
    loader: "auto",
  };

  return (
    <Elements stripe={getStripe()} options={options}>
      {children}
    </Elements>
  );
}
