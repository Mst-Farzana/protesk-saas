// stores/cart.ts (Complete Improved Version)
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { CartItem, Product } from '../types/index';

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);

  const itemCount = computed(() => items.value.reduce((count, item) => count + item.quantity, 0));

  const totalAmount = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  const addProduct = (product: Product, quantity = 1) => {
    const existing = items.value.find(item => item.productId === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      items.value.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        imageUrl: product.imageUrl,
      });
    }

    // ✅ Persist to localStorage
    if (import.meta.client) {
      localStorage.setItem('cart', JSON.stringify(items.value));
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const item = items.value.find(item => item.productId === productId);
    if (!item) return;

    if (quantity <= 0) {
      items.value = items.value.filter(item => item.productId !== productId);
    } else {
      item.quantity = quantity;
    }

    // ✅ Persist to localStorage
    if (import.meta.client) {
      localStorage.setItem('cart', JSON.stringify(items.value));
    }
  };

  const removeProduct = (productId: string) => {
    items.value = items.value.filter(item => item.productId !== productId);

    // ✅ Persist to localStorage
    if (import.meta.client) {
      localStorage.setItem('cart', JSON.stringify(items.value));
    }
  };

  const clearCart = () => {
    items.value = [];

    // ✅ Persist to localStorage
    if (import.meta.client) {
      localStorage.setItem('cart', JSON.stringify(items.value));
    }
  };

  // ✅ Load from localStorage on app initialization
  const loadFromStorage = () => {
    if (import.meta.client) {
      const stored = localStorage.getItem('cart');
      if (stored) {
        try {
          items.value = JSON.parse(stored);
        } catch (err) {
          console.error('Failed to load cart from localStorage:', err);
          items.value = [];
        }
      }
    }
  };

  return {
    items,
    itemCount,
    totalAmount,
    addProduct,
    updateQuantity,
    removeProduct,
    clearCart,
    loadFromStorage, // ✅ নতুন method
  };
});
