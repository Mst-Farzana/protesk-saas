// plugins/cart.client.ts
import { useCartStore } from '../stores/cart';

export default defineNuxtPlugin(() => {
  const cart = useCartStore();

  if (typeof cart.loadFromStorage === 'function') {
    cart.loadFromStorage();
  }
});
