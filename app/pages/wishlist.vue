<!-- pages/wishlist.vue -->
<template>
  <div class="bg-white dark:bg-slate-950 min-h-screen">
    <!-- Header -->
    <section
      class="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50"
    >
      <div
        class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"
      >
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">My Wishlist</h1>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {{ wishlist.items.length }} saved item{{ wishlist.items.length === 1 ? '' : 's' }}
          </p>
        </div>
        <NuxtLink
          to="/"
          class="inline-block rounded-full bg-cyan-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500"
        >
          Continue Shopping
        </NuxtLink>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <!-- ✅ Empty State -->
      <div v-if="!wishlist.items.length" class="flex flex-col items-center py-20 text-center">
        <div
          class="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20"
        >
          <svg class="h-10 w-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <h2 class="mt-6 text-xl font-bold text-slate-900 dark:text-white">
          Your wishlist is empty
        </h2>
        <p class="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Save products you love by clicking the heart icon, and they will appear here.
        </p>
        <NuxtLink
          to="/"
          class="mt-6 rounded-full border border-cyan-500 px-6 py-2.5 text-sm font-semibold text-cyan-600 transition hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-900/20"
        >
          Browse Products
        </NuxtLink>
      </div>

      <!-- ✅ Wishlist Grid -->
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="p in wishlist.items"
          :key="p.id"
          class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
        >
          <!-- Image -->
          <div class="relative aspect-square bg-slate-100 dark:bg-slate-800">
            <NuxtLink :to="`/products/${p.id}`" class="block h-full w-full">
              <NuxtImg
                v-if="p.imageUrl"
                :src="p.imageUrl"
                :alt="p.name"
                loading="lazy"
                class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div v-else class="flex h-full w-full items-center justify-center text-slate-400">
                <svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </NuxtLink>

            <!-- Remove Button -->
            <button
              type="button"
              :disabled="isRemoving(p.id)"
              aria-label="Remove from wishlist"
              class="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-red-500 shadow backdrop-blur transition hover:scale-110 hover:bg-red-500 hover:text-white disabled:opacity-50 dark:bg-slate-900/90"
              @click="removeItem(p)"
            >
              <svg
                v-if="isRemoving(p.id)"
                class="h-4 w-4 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  class="opacity-25"
                />
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  class="opacity-75"
                />
              </svg>
              <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>

          <!-- Info -->
          <div class="flex flex-1 flex-col p-4">
            <span
              v-if="p.category"
              class="text-xs font-medium uppercase tracking-wider text-cyan-600 dark:text-cyan-400"
            >
              {{ p.category }}
            </span>
            <NuxtLink
              :to="`/products/${p.id}`"
              class="mt-1 line-clamp-2 text-sm font-semibold text-slate-900 transition hover:text-cyan-600 dark:text-white dark:hover:text-cyan-400"
            >
              {{ p.name }}
            </NuxtLink>
            <div class="mt-auto flex items-center justify-between gap-2 pt-4">
              <p class="text-lg font-bold text-slate-900 dark:text-white">
                ${{ Number(p.price).toFixed(2) }}
              </p>
              <button
                type="button"
                :disabled="isAddingToCart(p.id)"
                class="flex items-center gap-1.5 rounded-full bg-cyan-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-cyan-500 disabled:opacity-50"
                @click="moveToCart(p)"
              >
                <svg
                  v-if="isAddingToCart(p.id)"
                  class="h-3.5 w-3.5 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                    class="opacity-25"
                  />
                  <path
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    class="opacity-75"
                  />
                </svg>
                <svg
                  v-else
                  class="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {{ isAddingToCart(p.id) ? 'Adding...' : 'Add to Cart' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from '../../stores/cart';
import { useWishlistStore } from '../../stores/Wishlist'; // ✅ ছোট w
import type { Product } from '../../types/index';

// ===== Stores =====
const cart = useCartStore();
const wishlist = useWishlistStore();

// ===== State =====
const removingIds = ref<Set<string>>(new Set());
const addingToCartIds = ref<Set<string>>(new Set());

// ===== Helper functions =====
const isRemoving = (id: string) => removingIds.value.has(id);
const isAddingToCart = (id: string) => addingToCartIds.value.has(id);

// ===== Remove from wishlist =====
const removeItem = (product: Product) => {
  if (!product.id || removingIds.value.has(product.id)) return;

  removingIds.value.add(product.id);

  try {
    wishlist.toggle(product);
  } catch (err) {
    console.error('❌ Remove error:', err);
  } finally {
    removingIds.value.delete(product.id);
  }
};

// ===== Move to cart =====
const moveToCart = (product: Product) => {
  if (!product.id || addingToCartIds.value.has(product.id)) return;

  addingToCartIds.value.add(product.id);

  try {
    // ✅ সঠিক method name: addProduct
    cart.addProduct(product);

    // Remove from wishlist
    wishlist.toggle(product);
  } catch (err) {
    console.error('❌ Add to cart error:', err);
  } finally {
    addingToCartIds.value.delete(product.id);
  }
};

// ===== SEO =====
useHead({ title: 'Wishlist | Protesk' });
</script>
