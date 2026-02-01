import type { Step } from "@/types/checkout";

// Checkout Flow Steps
export const CHECKOUT_STEPS: Step[] = [
  { id: 1, title: "Select Tickets", description: "Choose your tickets" },
  { id: 2, title: "Attendee Info", description: "Enter attendee details" },
  { id: 3, title: "Payment", description: "Complete your purchase" },
  { id: 4, title: "Confirmation", description: "Get your tickets" },
];

// Payment Processing Fees
export const STRIPE_FEE_PERCENTAGE = 0.029; // 2.9%
export const STRIPE_FEE_FIXED = 0.3; // $0.30

// Fee Calculation Helper
export const calculateProcessingFee = (amount: number): number => {
  return amount * STRIPE_FEE_PERCENTAGE + STRIPE_FEE_FIXED;
};

// Trust Signals for Order Summary
export const TRUST_SIGNALS = [
  { text: "Secure checkout with Stripe", color: "green" },
  { text: "Instant ticket delivery via email", color: "green" },
  { text: "All sales are final", color: "green" },
] as const;

// Ticket Limits
export const LOW_STOCK_THRESHOLD = 20; // Show "X left" when below this number
