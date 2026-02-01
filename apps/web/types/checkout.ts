// Web-only checkout and form types

export interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
  maxQuantity: number;
  available: number;
  features?: string[];
}

export interface TicketSelection {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface PaymentFormData {
  billingPostalCode: string;
  billingAddress: string;
  agreeToTerms: boolean;
  subscribeToNewsletter: boolean;
}

export interface StripePaymentResult {
  paymentIntentId: string;
  paymentMethodId?: string;
  chargeId?: string;
  status: string;
}

export interface Step {
  id: number;
  title: string;
  description: string;
}
