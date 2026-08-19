<template>
  <section class="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
    <!-- Loading State -->
    <div v-if="pending" class="text-center text-gray-500 dark:text-gray-400">
      <div
        class="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent"
      ></div>
      <p class="mt-3">Loading product…</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center text-red-600 dark:text-red-400">
      Failed to load product: {{ error.message }}
    </div>

    <!-- Product Display -->
    <div v-else-if="product" class="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
      <!-- ✅ Product Image Section (নতুন যোগ করা) -->
      <div
        class="overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950"
      >
        <img
          v-if="product.imageUrl"
          :src="product.imageUrl"
          :alt="product.name"
          class="h-full w-full object-cover transition duration-500 hover:scale-105"
        />
        <!-- Fallback: যদি imageUrl না থাকে -->
        <div
          v-else
          class="flex aspect-square items-center justify-center bg-gray-100 dark:bg-gray-900"
        >
          <svg
            class="h-24 w-24 text-gray-300 dark:text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      <!-- ✅ Product Info + Details (ডান পাশে একসাথে) -->
      <div class="space-y-6">
        <!-- Product Name & Description -->
        <div
          class="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950"
        >
          <p
            class="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400"
          >
            {{ product.category || 'Uncategorized' }}
          </p>
          <h1 class="mt-3 text-3xl font-semibold text-gray-900 dark:text-white">
            {{ product.name }}
          </h1>
          <p class="mt-4 text-sm leading-7 text-gray-600 dark:text-gray-400">
            {{ product.description || 'No description available.' }}
          </p>
        </div>

        <!-- Price, Stock & Add to Cart -->
        <div
          class="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950"
        >
          <div class="space-y-2">
            <p class="text-4xl font-semibold text-gray-900 dark:text-white">
              ${{ (Number(product.price) || 0).toFixed(2) }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Stock: <span class="font-medium">{{ product.stock ?? 0 }}</span>
            </p>
          </div>

          <button
            type="button"
            class="mt-6 w-full rounded-2xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="(product.stock ?? 0) <= 0"
            @click="addToCart"
          >
            {{ (product.stock ?? 0) > 0 ? 'Add to cart' : 'Out of stock' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineProduct, useFetch, useSchemaOrg } from '#imports';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '../../../stores/cart';
import type { Product } from '../../../types/index';

const route = useRoute();
const router = useRouter();
const cart = useCartStore();

// Fetch product by ID
const {
  data: product,
  pending,
  error,
} = await useFetch<Product>(`/api/products/${route.params.id}`);

// ✅ 404 handle করুন - যদি product না পাওয়া যায়
if (!pending.value && !product.value && !error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Product not found',
  });
}

// Add to cart function
const addToCart = () => {
  if (!product.value) return;
  cart.addProduct(product.value, 1);
  router.push('/cart');
};

// SEO Schema
useSchemaOrg([
  defineProduct({
    name: product.value?.name || '',
    description: product.value?.description || '',
    image: product.value?.imageUrl || '',
    offers: {
      price: Number(product.value?.price) || 0,
      priceCurrency: 'USD',
      availability: (product.value?.stock ?? 0) > 0 ? 'InStock' : 'OutOfStock',
    },
  }),
]);

// Page Meta
definePageMeta({
  layout: 'default',
});
</script>
