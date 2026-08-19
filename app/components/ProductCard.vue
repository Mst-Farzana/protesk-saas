<template>
  <article
    class="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950"
  >
    <!-- Product Image -->
    <NuxtLink :to="`/products/${product.id}`" class="block" :aria-label="`View ${product.name}`">
      <div class="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <!-- Image -->
        <img
          v-if="imageSrc"
          :src="imageSrc"
          :alt="product.name"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          @error="handleImageError"
        />

        <!-- Image Fallback -->
        <div
          v-else
          class="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 16.5l4.5-4.5a2.121 2.121 0 013 0l3 3 1.5-1.5a2.121 2.121 0 013 0L21 16.5M5 19.5h14a2 2 0 002-2v-11a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z"
            />
          </svg>

          <span class="text-sm"> No Image </span>
        </div>

        <!-- Out of Stock Badge -->
        <div
          v-if="(product.stock ?? 0) <= 0"
          class="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow"
        >
          Out of Stock
        </div>

        <!-- Category Badge -->
        <div
          v-else-if="product.category"
          class="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow backdrop-blur dark:bg-slate-950/90 dark:text-slate-200"
        >
          {{ product.category }}
        </div>
      </div>
    </NuxtLink>

    <!-- Product Information -->
    <div class="p-5">
      <!-- Category -->
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
        {{ product.category || 'Uncategorized' }}
      </p>

      <!-- Product Name -->
      <NuxtLink
        :to="`/products/${product.id}`"
        class="mt-2 block truncate text-lg font-semibold text-slate-900 transition hover:text-cyan-600 dark:text-white dark:hover:text-cyan-400"
      >
        {{ product.name }}
      </NuxtLink>

      <!-- Description -->
      <p
        v-if="product.description"
        class="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400"
      >
        {{ product.description }}
      </p>

      <!-- Price + Cart -->
      <div class="mt-4 flex items-center justify-between gap-3">
        <!-- Price -->
        <span class="text-lg font-bold text-slate-900 dark:text-white">
          ${{ formattedPrice }}
        </span>

        <!-- Add Button -->
        <button
          type="button"
          class="rounded-full bg-cyan-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 dark:focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="(product.stock ?? 0) <= 0"
          @click.stop="addToCart"
        >
          {{ (product.stock ?? 0) > 0 ? '+ Add' : 'Out of Stock' }}
        </button>
      </div>

      <!-- Stock -->
      <p v-if="(product.stock ?? 0) > 0" class="mt-3 text-xs text-slate-500 dark:text-slate-400">
        {{ product.stock }} available
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCartStore } from '../../stores/cart';
import type { Product } from '../../types/index';

const props = defineProps<{
  product: Product;
}>();

const cart = useCartStore();

/**
 * Keep the original URL in a ref so that
 * we can hide the image if the URL is broken.
 */
const imageSrc = ref(
  typeof props.product.imageUrl === 'string' ? props.product.imageUrl.trim() : ''
);

/**
 * Price formatting
 */
const formattedPrice = computed(() => {
  return (Number(props.product.price) || 0).toFixed(2);
});

/**
 * If image URL fails to load,
 * show the fallback instead.
 */
const handleImageError = () => {
  console.error('❌ Product image failed:', props.product.name, props.product.imageUrl);

  imageSrc.value = '';
};

/**
 * Add product to cart
 */
const addToCart = () => {
  if ((props.product.stock ?? 0) <= 0) return;

  cart.addProduct(props.product, 1);
};

/**
 * Debug
 */
console.log('🖼️ Product:', props.product.name, '| Image URL:', props.product.imageUrl);
</script>
