import { useWishlistStore } from '../stores/Wishlist';

export default defineNuxtPlugin(() => {
  const wishlist = useWishlistStore();
  wishlist.loadFromStorage();
});
