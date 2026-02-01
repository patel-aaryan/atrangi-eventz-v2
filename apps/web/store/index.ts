import { configureStore } from "@reduxjs/toolkit";
import checkoutReducer from "./slices/checkoutSlice";

type LoadedState = {
  checkout: ReturnType<typeof checkoutReducer>;
};

// Session storage persistence helper
const loadState = () => {
  // Check if we're in the browser environment
  if (typeof window === "undefined") {
    return undefined;
  }
  try {
    const serializedState = sessionStorage.getItem("reduxState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Error loading redux state:", err);
    return undefined;
  }
};

export const store = configureStore({
  reducer: { checkout: checkoutReducer },
  preloadedState: loadState() as LoadedState | undefined,
});

store.subscribe(() => {
  // Check if we're in the browser environment
  if (typeof window === "undefined") {
    return;
  }
  try {
    const serializedState = JSON.stringify(store.getState());
    sessionStorage.setItem("reduxState", serializedState);
  } catch (err) {
    console.error(err);
    // Ignore write errors
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
