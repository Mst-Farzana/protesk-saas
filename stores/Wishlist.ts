// stores/wishlist.ts
import { defineStore } from 'pinia';
import type { Product } from '../types/index';

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: [] as Product[],
  }),
  getters: {
    count: state => state.items.length,
    has: state => (id: string) => state.items.some(p => p.id === id),
  },
  actions: {
    toggle(product: Product) {
      const idx = this.items.findIndex(p => p.id === product.id);
      if (idx >= 0) this.items.splice(idx, 1);
      else this.items.push(product);

      // ✅ Persist to localStorage (client-side only)
      if (import.meta.client) {
        localStorage.setItem('wishlist', JSON.stringify(this.items));
      }
    },

    // ✅ Load from localStorage on app initialization
    loadFromStorage() {
      if (import.meta.client) {
        const stored = localStorage.getItem('wishlist');
        if (stored) {
          try {
            this.items = JSON.parse(stored);
          } catch (err) {
            console.error('Failed to load wishlist from localStorage:', err);
            this.items = [];
          }
        }
      }
    },
  },
});
