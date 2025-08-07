import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ShoeItem } from "@/entities/shoe/types";

interface CartItem extends ShoeItem {
  id: string;
  quantity: number;
  customization?: Record<string, string>;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Omit<ShoeItem, "quantity" | "id">>) {
      const { model, size, customization, customizable } =
        action.payload;

      const existing = state.items.find((item) => {
        return (
          item.model === model &&
          item.size === size &&
          item.customizable === customizable &&
          JSON.stringify(item.customization || {}) ===
            JSON.stringify(customization || {})
        );
      });

      if (existing) {
        existing.quantity += 1;
      } else {
        const id = `${model}-${size}-${Date.now()}`;
        state.items.push({
          ...action.payload,
          id,
          quantity: 1,
        });
      }
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  slice.actions;

export default slice.reducer;
