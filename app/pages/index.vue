<template>
  <div>
    <!-- =========================================================
         HERO
    ========================================================== -->
    <section class="relative overflow-hidden bg-white dark:bg-[#050d1c]">
      <!-- Light Background -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-cyan-50 via-blue-50 to-white dark:hidden"
      />

      <!-- Dark Background -->
      <div
        class="absolute inset-0 hidden bg-gradient-to-b from-[#040a18] via-[#071630] to-[#0a2242] dark:block"
      />

      <!-- Light Glow -->
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_65%_70%,rgba(6,182,212,0.15),transparent_60%)] dark:hidden"
      />

      <!-- Dark Glow -->
      <div
        class="absolute inset-0 hidden bg-[radial-gradient(ellipse_at_65%_70%,rgba(29,111,242,0.28),transparent_60%)] dark:block"
      />

      <!-- Light Blur -->
      <div
        class="absolute -bottom-10 left-1/2 h-72 w-[120%] -translate-x-1/2 bg-cyan-400/20 blur-3xl dark:hidden"
      />

      <!-- Dark Blur -->
      <div
        class="absolute -bottom-10 left-1/2 hidden h-72 w-[120%] -translate-x-1/2 bg-cyan-500/10 blur-3xl dark:block"
      />

      <!-- =======================================================
           LIGHT WAVES
      ======================================================== -->
      <svg
        class="pointer-events-none absolute inset-0 h-full w-full dark:hidden"
        viewBox="0 0 1440 700"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="waveStrokeLight"
            x1="0"
            y1="0"
            x2="1440"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stop-color="#06b6d4" stop-opacity="0" />
            <stop offset="0.25" stop-color="#0891b2" stop-opacity="0.4" />
            <stop offset="0.55" stop-color="#06b6d4" stop-opacity="0.6" />
            <stop offset="0.8" stop-color="#0891b2" stop-opacity="0.3" />
            <stop offset="1" stop-color="#06b6d4" stop-opacity="0" />
          </linearGradient>
        </defs>

        <g class="wave-a">
          <path
            v-for="i in 22"
            :key="`light-a-${i}`"
            d="M-80 430 C 160 320, 340 320, 520 420 C 700 520, 820 530, 980 440 C 1140 350, 1300 350, 1520 440"
            :transform="`translate(0 ${(i - 1) * 7})`"
            stroke="url(#waveStrokeLight)"
            :stroke-width="i % 5 === 0 ? 1.6 : 1"
            :opacity="Math.max(0.1, 0.6 - (i - 1) * 0.02)"
          />
        </g>

        <g class="wave-b">
          <path
            v-for="i in 18"
            :key="`light-b-${i}`"
            d="M620 470 C 780 570, 950 580, 1080 500 C 1190 432, 1200 372, 1110 342 C 1020 312, 930 362, 960 432 C 990 502, 1180 520, 1520 460"
            :transform="`translate(0 ${(i - 1) * 6})`"
            stroke="url(#waveStrokeLight)"
            :stroke-width="i % 4 === 0 ? 1.4 : 0.9"
            :opacity="Math.max(0.1, 0.5 - (i - 1) * 0.025)"
          />
        </g>
      </svg>

      <!-- =======================================================
           DARK WAVES
      ======================================================== -->
      <svg
        class="pointer-events-none absolute inset-0 hidden h-full w-full dark:block"
        viewBox="0 0 1440 700"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="waveStrokeDark"
            x1="0"
            y1="0"
            x2="1440"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stop-color="#1d6ff2" stop-opacity="0" />
            <stop offset="0.25" stop-color="#2f8cff" stop-opacity="0.7" />
            <stop offset="0.55" stop-color="#37c8ff" stop-opacity="0.95" />
            <stop offset="0.8" stop-color="#2f8cff" stop-opacity="0.6" />
            <stop offset="1" stop-color="#1d6ff2" stop-opacity="0" />
          </linearGradient>

          <filter id="waveGlowDark" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g class="wave-a" filter="url(#waveGlowDark)">
          <path
            v-for="i in 22"
            :key="`dark-a-${i}`"
            d="M-80 430 C 160 320, 340 320, 520 420 C 700 520, 820 530, 980 440 C 1140 350, 1300 350, 1520 440"
            :transform="`translate(0 ${(i - 1) * 7})`"
            stroke="url(#waveStrokeDark)"
            :stroke-width="i % 5 === 0 ? 1.6 : 1"
            :opacity="Math.max(0.15, 0.9 - (i - 1) * 0.032)"
          />
        </g>

        <g class="wave-b" filter="url(#waveGlowDark)">
          <path
            v-for="i in 18"
            :key="`dark-b-${i}`"
            d="M620 470 C 780 570, 950 580, 1080 500 C 1190 432, 1200 372, 1110 342 C 1020 312, 930 362, 960 432 C 990 502, 1180 520, 1520 460"
            :transform="`translate(0 ${(i - 1) * 6})`"
            stroke="url(#waveStrokeDark)"
            :stroke-width="i % 4 === 0 ? 1.4 : 0.9"
            :opacity="Math.max(0.15, 0.85 - (i - 1) * 0.04)"
          />
        </g>
      </svg>

      <!-- HERO CONTENT -->
      <div class="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <p
          class="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400"
        >
          Protesk Store
        </p>

        <h1
          class="mt-6 mb-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl"
        >
          Modern E-commerce,
          <span class="text-cyan-600 dark:text-cyan-400 mt-2 mb-2"> AI-Powered </span>
        </h1>

        <p class="mt-5 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300/80">
          Find the right products with AI, manage orders, products and payments from one unified
          e-commerce platform.
        </p>

        <div class="mt-9 flex flex-wrap gap-3">
          <button
            type="button"
            class="rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 px-7 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-cyan-500 hover:to-blue-500"
            @click="focusAiSearch"
          >
            ✨ Ask AI
          </button>

          <NuxtLink
            to="/admin"
            class="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-7 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Open Admin Panel
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- =========================================================
         AI SHOPPING COPILOT
    ========================================================== -->
    <section id="ai-shopping" class="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
      <div
        class="rounded-3xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50 p-6 shadow-sm dark:border-cyan-900/60 dark:from-slate-900 dark:to-slate-950"
      >
        <!-- Header -->
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div
              class="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-3 py-1 text-xs font-semibold text-cyan-700 dark:border-cyan-900 dark:bg-slate-950 dark:text-cyan-400"
            >
              ✨ AI Shopping Copilot
            </div>

            <h2 class="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
              Tell AI what you want to buy
            </h2>

            <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
              AI analyzes your request and finds the best matching products from your real catalog.
            </p>
          </div>

          <div class="text-sm text-slate-500 dark:text-slate-400">
            <p>Try:</p>

            <div class="mt-1 flex flex-wrap gap-2">
              <button
                v-for="example in aiExamples"
                :key="example"
                type="button"
                class="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs transition hover:border-cyan-400 hover:text-cyan-600 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-cyan-500"
                @click="useAiExample(example)"
              >
                {{ example }}
              </button>
            </div>
          </div>
        </div>

        <!-- SEARCH -->
        <form
          ref="aiForm"
          class="mt-6 flex flex-col gap-3 md:flex-row"
          @submit.prevent="loadAiRecommendations"
        >
          <div class="relative flex-1">
            <span
              class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500"
            >
              ✨
            </span>

            <input
              ref="aiInput"
              v-model="aiQuery"
              type="text"
              autocomplete="off"
              placeholder="e.g. I need a good laptop for work under $1000..."
              class="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>

          <button
            type="submit"
            :disabled="aiLoading"
            class="rounded-2xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span v-if="aiLoading" class="flex items-center gap-2">
              <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />

                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>

              Thinking...
            </span>

            <span v-else> Ask AI </span>
          </button>
        </form>

        <!-- ERROR -->
        <div
          v-if="aiError"
          class="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-400"
        >
          {{ aiError }}
        </div>

        <!-- =====================================================
             AI RESULTS
        ====================================================== -->
        <div v-if="aiRecommendations.length" class="mt-8">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">
                AI Recommended Products
              </h3>

              <p class="text-xs text-slate-500 dark:text-slate-400">
                {{ aiRecommendations.length }} products matched your request.
              </p>
            </div>

            <span
              class="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400"
            >
              AI Match
            </span>
          </div>

          <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <article
              v-for="item in aiRecommendations"
              :key="item.id"
              class="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950"
            >
              <!-- Product Image -->
              <div class="relative overflow-hidden bg-slate-100 dark:bg-slate-900">
                <NuxtImg
                  v-if="item.imageUrl"
                  :src="item.imageUrl"
                  :alt="item.name"
                  width="500"
                  height="300"
                  format="webp"
                  quality="85"
                  loading="lazy"
                  class="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div v-else class="flex h-48 w-full items-center justify-center text-slate-400">
                  No Image
                </div>

                <!-- AI Badge -->
                <div
                  class="absolute left-3 top-3 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur"
                >
                  ✨ AI Pick
                </div>
              </div>

              <!-- Content -->
              <div class="p-5">
                <p
                  class="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400"
                >
                  {{ item.category || 'Recommended' }}
                </p>

                <h3 class="mt-2 line-clamp-2 text-lg font-bold text-slate-900 dark:text-white">
                  {{ item.name }}
                </h3>

                <!-- AI Reason -->
                <div class="mt-4 rounded-xl bg-cyan-50 p-3 dark:bg-cyan-950/30">
                  <div class="flex gap-2 text-xs font-semibold text-cyan-700 dark:text-cyan-400">
                    <span>✨</span>
                    <span>Why AI picked this</span>
                  </div>

                  <p class="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
                    {{ item.reason }}
                  </p>
                </div>

                <!-- Price + Cart -->
                <div class="mt-5 flex items-center justify-between gap-3">
                  <div>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Price</p>

                    <p class="text-xl font-bold text-slate-900 dark:text-white">
                      ${{ formatPrice(item.price) }}
                    </p>
                  </div>

                  <button
                    type="button"
                    class="rounded-full bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
                    @click="addRecommendedProduct(item)"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- NO RESULTS -->
        <div
          v-else-if="aiSearched && !aiLoading && !aiError"
          class="mt-6 rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700"
        >
          <div class="text-3xl">🔎</div>

          <p class="mt-3 font-semibold text-slate-900 dark:text-white">
            No matching products found
          </p>

          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Try describing your budget, category, or use case.
          </p>
        </div>
      </div>
    </section>

    <!-- =========================================================
         MAIN CONTENT
    ========================================================== -->
    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <!-- DEMO STRIPE -->
      <div
        class="rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800 dark:border-yellow-600/60 dark:bg-yellow-900/20 dark:text-yellow-200"
      >
        <p class="font-bold">⚠️ Demo Mode - Stripe Test</p>

        <p class="text-sm">
          Use test card:

          <code class="rounded bg-yellow-100 px-2 py-1 dark:bg-yellow-900/40">
            4242 4242 4242 4242
          </code>

          | Exp:

          <code class="rounded bg-yellow-100 px-2 py-1 dark:bg-yellow-900/40"> 12/34 </code>

          | CVC:

          <code class="rounded bg-yellow-100 px-2 py-1 dark:bg-yellow-900/40"> 123 </code>
        </p>
      </div>

      <!-- PRODUCTS + CART -->
      <div class="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <!-- PRODUCTS -->
        <ProductsGrid />

        <!-- CART -->
        <section
          class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
        >
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Shopping Cart</h2>

              <p class="text-sm text-slate-500 dark:text-slate-400">
                Review your items and checkout with Stripe.
              </p>
            </div>

            <span
              class="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {{ cart.itemCount }} items
            </span>
          </div>

          <div class="mt-6 space-y-4">
            <!-- EMPTY -->
            <div
              v-if="cart.items.length === 0"
              class="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400"
            >
              Your cart is empty.
            </div>

            <!-- ITEMS -->
            <div v-else class="space-y-4">
              <div
                v-for="item in cart.items"
                :key="item.productId"
                class="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <div class="flex items-center justify-between gap-4">
                  <!-- Product -->
                  <div class="flex min-w-0 items-center gap-3">
                    <NuxtImg
                      v-if="item.imageUrl"
                      :src="item.imageUrl"
                      :alt="item.name"
                      width="48"
                      height="48"
                      format="webp"
                      quality="80"
                      loading="lazy"
                      class="h-12 w-12 shrink-0 rounded-lg object-cover"
                    />

                    <div class="min-w-0">
                      <p class="truncate font-semibold text-slate-900 dark:text-white">
                        {{ item.name }}
                      </p>

                      <p class="text-sm text-slate-500 dark:text-slate-400">
                        ${{ formatPrice(item.price) }}
                      </p>
                    </div>
                  </div>

                  <!-- Quantity -->
                  <div class="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      class="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                      @click="updateQuantity(item.productId, item.quantity - 1)"
                    >
                      -
                    </button>

                    <span
                      class="min-w-[2rem] text-center text-sm font-semibold text-slate-900 dark:text-white"
                    >
                      {{ item.quantity }}
                    </span>

                    <button
                      type="button"
                      class="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                      @click="updateQuantity(item.productId, item.quantity + 1)"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <!-- SUMMARY -->
              <div class="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-900/70">
                <div
                  class="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400"
                >
                  <span>Subtotal</span>

                  <span class="font-semibold text-slate-900 dark:text-white">
                    ${{ formatPrice(cart.totalAmount) }}
                  </span>
                </div>

                <button
                  type="button"
                  :disabled="checkoutLoading || cart.items.length === 0"
                  class="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-cyan-500 dark:hover:bg-cyan-600"
                  @click="handleStripeCheckout"
                >
                  <svg
                    v-if="checkoutLoading"
                    class="h-5 w-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    />

                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>

                  <span>
                    {{ checkoutLoading ? 'Redirecting to Stripe...' : 'Pay with Stripe' }}
                  </span>
                </button>

                <div
                  class="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400"
                >
                  🔒
                  <span> Secure payment powered by Stripe </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta } from '#imports';
import { nextTick, onMounted, ref } from 'vue';

import { useCartStore } from '../../stores/cart';
import type { Product } from '../../types/index';
import { useProducts } from '../composables/useProducts';

const cart = useCartStore();

const { products, findById } = useProducts();

/* =========================================================
   AI TYPES
========================================================= */

interface AiRecommendation {
  id: string;
  name: string;
  price: number;
  category?: string | null;
  reason: string;
  imageUrl?: string | null;
}

/* =========================================================
   AI STATE
========================================================= */

const aiInput = ref<HTMLInputElement | null>(null);

const aiForm = ref<HTMLFormElement | null>(null);

const aiQuery = ref('Best value under $250');

const aiLoading = ref(false);

const aiError = ref('');

const aiSearched = ref(false);

const aiRecommendations = ref<AiRecommendation[]>([]);

/* =========================================================
   AI EXAMPLES
========================================================= */

const aiExamples = ['Best value under $250', 'Work setup', 'Gaming setup', 'Audio gear'];

/* =========================================================
   PRICE
========================================================= */

const formatPrice = (value?: number | null) => {
  return (Number(value) || 0).toFixed(2);
};

/* =========================================================
   FOCUS AI
========================================================= */

const focusAiSearch = async () => {
  await nextTick();

  document.getElementById('ai-shopping')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });

  await nextTick();

  aiInput.value?.focus();
};

/* =========================================================
   AI EXAMPLE
========================================================= */

const useAiExample = async (example: string) => {
  aiQuery.value = example;

  await nextTick();

  aiInput.value?.focus();

  await loadAiRecommendations();
};

/* =========================================================
   CART
========================================================= */

const updateQuantity = (productId: string, quantity: number) => {
  cart.updateQuantity(productId, quantity);
};

/* =========================================================
   ADD AI PRODUCT
========================================================= */

const addRecommendedProduct = (item: AiRecommendation) => {
  const product = findById(item.id);

  if (!product) {
    aiError.value = 'This AI recommendation is no longer available in the catalog.';

    return;
  }

  cart.addProduct(product, 1);
};

/* =========================================================
   AI RECOMMENDATIONS
========================================================= */

const loadAiRecommendations = async () => {
  const query = aiQuery.value.trim();

  if (!query) {
    aiError.value = 'Please describe what you want to buy.';

    return;
  }

  aiLoading.value = true;
  aiError.value = '';
  aiSearched.value = true;
  aiRecommendations.value = [];

  try {
    const response = await $fetch<{
      query: string;
      recommendations?: Array<{
        id: string;
        name: string;
        price: number;
        category?: string | null;
        reason: string;
        imageUrl?: string | null;
      }>;
    }>('/api/ai/recommendations', {
      method: 'POST',

      body: {
        query,
      },
    });

    const recommendations = response?.recommendations ?? [];

    /*
     * Backend imageUrl না পাঠালেও
     * local catalog থেকে image নেওয়া হবে।
     */
    aiRecommendations.value = recommendations
      .map(recommendation => {
        const product = findById(recommendation.id);

        return {
          ...recommendation,

          price: Number(recommendation.price ?? product?.price ?? 0) || 0,

          imageUrl: recommendation.imageUrl ?? product?.imageUrl ?? null,

          category: recommendation.category ?? product?.category ?? null,
        };
      })
      .filter(item => {
        return Boolean(findById(item.id));
      })
      .slice(0, 6);

    if (!aiRecommendations.value.length) {
      aiError.value = 'No matching products were found for your request.';
    }
  } catch (err: any) {
    console.error('AI recommendation error:', err);

    aiError.value =
      err?.data?.statusMessage || err?.message || 'AI recommendations are temporarily unavailable.';

    aiRecommendations.value = [];
  } finally {
    aiLoading.value = false;
  }
};

/* =========================================================
   STRIPE CHECKOUT
========================================================= */

const checkoutLoading = ref(false);

const handleStripeCheckout = async () => {
  if (!cart.items.length) {
    return;
  }

  checkoutLoading.value = true;

  try {
    const response = await $fetch<{
      url?: string;
    }>('/api/stripe/checkout', {
      method: 'POST',

      body: {
        items: cart.items,
        userId: 'guest-user',
      },
    });

    if (!response?.url) {
      throw new Error('No checkout URL received');
    }

    window.location.href = response.url;
  } catch (err: any) {
    console.error('Checkout failed:', err);

    if (import.meta.client) {
      alert(`Checkout failed: ${err?.message || 'Please try again.'}`);
    }
  } finally {
    checkoutLoading.value = false;
  }
};

/* =========================================================
   INITIAL AI
========================================================= */

onMounted(() => {
  loadAiRecommendations();
});

/* =========================================================
   SEO
========================================================= */

useSeoMeta({
  title: 'Protesk - AI-Powered E-commerce Store',

  description:
    'AI-powered modern e-commerce store with smart product recommendations and FinTech-ready checkout.',

  ogTitle: 'Protesk - AI-Powered E-commerce',

  ogDescription: 'Find the right products with AI and checkout securely with Stripe.',

  ogImage: '/__og-image__/image.png',

  twitterCard: 'summary_large_image',
});

/* =========================================================
   SCHEMA
========================================================= */

useSchemaOrg([
  defineWebSite({
    name: 'Protesk',

    description: 'AI-Powered Modern E-commerce Store',
  }),

  ...products.value.map((product: Product) =>
    defineProduct({
      name: product.name,

      description: product.description,

      image: product.imageUrl,

      offers: {
        price: product.price ?? 0,

        priceCurrency: 'USD',

        availability: (product.stock ?? 0) > 0 ? 'InStock' : 'OutOfStock',
      },
    })
  ),
]);

/* =========================================================
   PAGE META
========================================================= */

definePageMeta({
  layout: 'default',
});
</script>

<style scoped>
.wave-a {
  animation: drift-a 16s ease-in-out infinite alternate;
}

.wave-b {
  animation: drift-b 20s ease-in-out infinite alternate;
}

@keyframes drift-a {
  from {
    transform: translateX(-30px);
  }

  to {
    transform: translateX(30px);
  }
}

@keyframes drift-b {
  from {
    transform: translateX(25px);
  }

  to {
    transform: translateX(-25px);
  }
}
</style>
