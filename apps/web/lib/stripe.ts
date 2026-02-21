import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | undefined;

/**
 * Get the Stripe.js instance (client-side only)
 * This ensures we only load Stripe once and reuse the instance
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      console.error("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
      return Promise.resolve(null);
    }

    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
};

/**
 * Stripe Elements appearance configuration
 * Matches the app's theme with gradient primary colors
 */
export const stripeElementsAppearance = {
  theme: "stripe" as const,
  variables: {
    colorPrimary: "#e5a93d", // Primary amber/gold color
    colorBackground: "#ffffff",
    colorText: "#1a1a1a",
    colorDanger: "#ef4444",
    fontFamily: "system-ui, -apple-system, sans-serif",
    borderRadius: "0.65rem",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      border: "1px solid #e5e5e5",
      boxShadow: "none",
      padding: "12px",
    },
    ".Input:focus": {
      border: "1px solid #e5a93d",
      boxShadow: "0 0 0 1px #e5a93d",
    },
    ".Input--invalid": {
      border: "1px solid #ef4444",
    },
    ".Label": {
      fontWeight: "500",
      marginBottom: "8px",
    },
    ".Error": {
      color: "#ef4444",
      fontSize: "14px",
      marginTop: "4px",
    },
  },
};

/**
 * Dark mode appearance configuration
 */
export const stripeElementsAppearanceDark = {
  theme: "night" as const,
  variables: {
    colorPrimary: "#e5a93d",
    colorBackground: "#1a1a1a",
    colorText: "#ffffff",
    colorDanger: "#f87171",
    fontFamily: "system-ui, -apple-system, sans-serif",
    borderRadius: "0.65rem",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      border: "1px solid rgba(255, 255, 255, 0.15)",
      boxShadow: "none",
      padding: "12px",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
    ".Input:focus": {
      border: "1px solid #e5a93d",
      boxShadow: "0 0 0 1px #e5a93d",
    },
    ".Input--invalid": {
      border: "1px solid #f87171",
    },
    ".Label": {
      fontWeight: "500",
      marginBottom: "8px",
    },
    ".Error": {
      color: "#f87171",
      fontSize: "14px",
      marginTop: "4px",
    },
  },
};
