export interface CreatePaymentIntentParams {
  amount: number; // Amount in cents
  eventId: string;
  sessionId: string;
  eventTitle?: string;
  ticketSelections?: Array<{
    ticketId: string;
    ticketName: string;
    quantity: number;
  }>;
}

export interface CreatePaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
}
