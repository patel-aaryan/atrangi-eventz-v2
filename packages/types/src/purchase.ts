export interface CompletePurchaseData {
  eventId: string;
  ticketSelections: Array<{
    ticketId: string;
    ticketName: string;
    tierIndex: number;
    pricePerTicket: number;
    quantity: number;
  }>;
  attendeeInfo: Array<{
    ticketId: string;
    firstName: string;
    lastName: string;
  }>;
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  paymentInfo: {
    subtotal: number;
    discount: number;
    processingFee: number;
    total: number;
    stripePaymentIntentId?: string;
    stripeChargeId?: string;
    stripePaymentMethodId?: string;
    stripeCustomerId?: string;
    paymentStatus?: string;
  };
  billingInfo?: {
    zip?: string;
    address?: string;
  };
  promoCode?: string;
}

export interface CompletePurchaseResult {
  orderId: string;
  orderNumber: string;
  tickets: Array<{
    id: string;
    ticketCode: string;
    attendeeName: string;
  }>;
}
