export interface CreateOrderData {
  subtotal: number;
  discount: number;
  processingFee: number;
  total: number;
  currency?: string;
  buyerFirstName: string;
  buyerLastName: string;
  buyerEmail: string;
  buyerPhone?: string;
  billingZip?: string;
  billingAddress?: string;
  promoCode?: string;
  discountAmount?: number;
  stripePaymentIntentId?: string;
  stripeChargeId?: string;
  stripePaymentMethodId?: string;
  stripeCustomerId?: string;
  paymentStatus?: string;
}

export interface Order {
  id: string;
  order_number: string;
  subtotal: number;
  discount: number;
  processing_fee: number;
  total: number;
  currency: string;
  buyer_first_name: string;
  buyer_last_name: string;
  buyer_email: string;
  buyer_phone: string | null;
  billing_zip: string | null;
  billing_address: string | null;
  promo_code: string | null;
  discount_amount: number;
  stripe_payment_intent_id: string | null;
  stripe_charge_id: string | null;
  stripe_payment_method_id: string | null;
  payment_status: string | null;
  status: string;
  purchased_at: Date;
  created_at: Date;
  updated_at: Date;
}
