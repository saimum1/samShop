"use client"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface CartItem {
  id: string ;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  category: string;
  
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ id: string ; name: string; price: number; image: string; quantity: number , category: string }>
    ) => {
      const item = action.payload;
      const existingItem = state.items.find((i) => i.id === item.id);

      if (existingItem) {
        existingItem.quantity += item.quantity; // add selected quantity
      } else {
        state.items.push(item);
      }
      console.log("aded", item)
    },
    removeFromCart: (state, action: PayloadAction<string | number>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },

    clearCart: (state) => {
      state.items =[];
    },
    decreaseQuantity: (state, action: PayloadAction<string | number>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter((i) => i.id !== action.payload);
        }
      }
    },

    increaseQuantity: (state, action: PayloadAction<string | number>) => {
        const item = state.items?.find((i)=>i.id === action.payload)
        if(item){
            item.quantity += 1
        }
    },
   
  },
});

export const { addToCart, removeFromCart, decreaseQuantity, clearCart ,increaseQuantity } = cartSlice.actions;
export default cartSlice.reducer;
