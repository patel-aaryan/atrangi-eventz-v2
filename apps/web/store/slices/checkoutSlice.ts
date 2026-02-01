import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CheckoutFormInput } from "@/lib/validation/checkout";

interface PaymentIntentData {
  clientSecret: string;
  paymentIntentId: string;
  createdAt: number;
  amount: number;
  eventId: string;
}

interface ReservationData {
  createdAt: number;
  eventId: string;
}

export interface CheckoutState {
  formData: CheckoutFormInput | null;
  paymentIntent: PaymentIntentData | null;
  reservation: ReservationData | null;
}

const initialState: CheckoutState = {
  formData: null,
  paymentIntent: null,
  reservation: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCheckoutData: (state, action: PayloadAction<CheckoutFormInput>) => {
      state.formData = action.payload;
    },
    clearCheckoutData: (state) => {
      state.formData = null;
    },
    setPaymentIntent: (state, action: PayloadAction<PaymentIntentData>) => {
      state.paymentIntent = action.payload;
    },
    clearPaymentIntent: (state) => {
      state.paymentIntent = null;
    },
    setReservation: (state, action: PayloadAction<ReservationData>) => {
      state.reservation = action.payload;
    },
    clearReservation: (state) => {
      state.reservation = null;
    },
    clearAllCheckoutData: (state) => {
      state.formData = null;
      state.paymentIntent = null;
      state.reservation = null;
    },
  },
});

export const {
  setCheckoutData,
  clearCheckoutData,
  setPaymentIntent,
  clearPaymentIntent,
  setReservation,
  clearReservation,
  clearAllCheckoutData,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;

