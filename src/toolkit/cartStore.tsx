
"use client";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { CartItem } from "./cartSlice";


const loadState = () => {
  try {
    const serializedState = localStorage.getItem("cart");
    if (serializedState === null) return undefined;
    return { cart: JSON.parse(serializedState) };
  } catch (err) {
    console.error("Failed to load state", err);
    return undefined;
  }
};

// Save cart to localStorage
const saveState = (state: { cart: { items: CartItem[] } }) => {
  try {
    const serializedState = JSON.stringify(state.cart);
    localStorage.setItem("cart", serializedState);
  } catch (err) {
    console.error("Failed to save state", err);
  }
};

const preloadedState = typeof window !== "undefined" ? loadState() : undefined;

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState,
});

// Subscribe to store changes
store.subscribe(() => saveState(store.getState()));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
