<template>
  <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
    <!-- Page Title -->
    <h1 class="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Checkout</h1>

    <!-- Success Message -->
    <div
      v-if="successMessage"
      class="mb-6 rounded-lg border border-green-300 bg-green-50 p-4 text-green-800 dark:border-green-600 dark:bg-green-900/30 dark:text-green-200"
      role="alert"
    >
      <p class="font-bold">✅ Success!</p>
      <p class="text-sm">{{ successMessage }}</p>
    </div>

    <!-- Error Message -->
    <div
      v-if="errorMessage"
      class="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-600 dark:bg-red-900/30 dark:text-red-200"
      role="alert"
    >
      <p class="font-bold">❌ Error!</p>
      <p class="text-sm">{{ errorMessage }}</p>
    </div>

    <!-- Demo Badge -->
    <div
      class="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800 dark:border-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-200"
    >
      <p class="font-bold">⚠️ Demo Mode</p>

      <p class="text-sm">
        Use test card:
        <code class="rounded bg-yellow-100 px-2 py-1 dark:bg-yellow-900/50">
          4242 4242 4242 4242
        </code>

        | Exp:
        <code class="rounded bg-yellow-100 px-2 py-1 dark:bg-yellow-900/50"> 12/34 </code>

        | CVC:
        <code class="rounded bg-yellow-100 px-2 py-1 dark:bg-yellow-900/50"> 123 </code>
      </p>
    </div>

    <div class="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <!-- Left Column -->
      <div class="space-y-6">
        <!-- Customer Information -->
        <section class="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Customer Information
          </h2>

          <form class="space-y-4" @submit.prevent="handleCheckout">
            <!-- Email -->
            <div>
              <label
                for="email"
                class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address *
              </label>

              <input
                id="email"
                v-model="customerInfo.email"
                type="email"
                required
                autocomplete="email"
                class="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="you@example.com"
              />
            </div>

            <!-- Full Name -->
            <div>
              <label
                for="name"
                class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Full Name *
              </label>

              <input
                id="name"
                v-model="customerInfo.name"
                type="text"
                required
                autocomplete="name"
                class="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="John Doe"
              />
            </div>
          </form>
        </section>

        <!-- Order Items -->
        <section class="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Order Items</h2>

          <!-- Empty Cart -->
          <div
            v-if="cart.items.length === 0"
            class="py-8 text-center text-gray-500 dark:text-gray-400"
          >
            Your cart is empty.
          </div>

          <!-- Items -->
          <div v-else class="space-y-4">
            <div
              v-for="(item, index) in cart.items"
              :key="item.productId || index"
              class="flex items-center gap-4 border-b border-gray-200 pb-4 last:border-0 dark:border-gray-700"
            >
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 dark:text-white">
                  {{ item.name }}
                </h3>

                <p class="text-sm text-gray-500 dark:text-gray-400">
                  ${{ Number(item.price).toFixed(2) }}
                  ×
                  {{ item.quantity }}
                </p>
              </div>

              <div class="text-right">
                <p class="font-semibold text-gray-900 dark:text-white">
                  ${{ (Number(item.price) * Number(item.quantity)).toFixed(2) }}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Column -->
      <div class="lg:sticky lg:top-8 lg:self-start">
        <section class="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Order Summary</h2>

          <!-- Summary -->
          <div class="space-y-3 border-b border-gray-200 pb-4 dark:border-gray-700">
            <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>

            <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Tax (10%)</span>
              <span>${{ tax.toFixed(2) }}</span>
            </div>

            <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Shipping</span>
              <span class="text-green-600">Free</span>
            </div>
          </div>

          <!-- Total -->
          <div class="flex justify-between py-4 text-lg font-bold text-gray-900 dark:text-white">
            <span>Total</span>
            <span>${{ total.toFixed(2) }}</span>
          </div>

          <!-- Checkout Button -->
          <button
            type="button"
            :disabled="isProcessing || cart.items.length === 0"
            class="mt-4 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-800"
            @click="handleCheckout"
          >
            <span v-if="isProcessing" class="flex items-center justify-center gap-2">
              <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>

              Processing...
            </span>

            <span v-else> Pay with Stripe </span>
          </button>

          <!-- Security Badge -->
          <div
            class="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>

            <span> Secure payment powered by Stripe </span>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useCartStore } from '../../stores/cart';

// ===== Types =====

interface CartItem {
  id?: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CustomerInfo {
  email: string;
  name: string;
}

// ===== Store & Route =====

const cart = useCartStore();
const route = useRoute();

// ===== State =====

const isProcessing = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const customerInfo = ref<CustomerInfo>({
  email: '',
  name: '',
});

// ===== Computed =====

const subtotal = computed(() => {
  return cart.items.reduce((sum, item) => {
    return sum + Number(item.price) * Number(item.quantity);
  }, 0);
});

const tax = computed(() => {
  return subtotal.value * 0.1;
});

const total = computed(() => {
  return subtotal.value + tax.value;
});

// ===== Helpers =====

const clearMessages = () => {
  successMessage.value = '';
  errorMessage.value = '';
};

const showError = (message: string) => {
  errorMessage.value = message;

  setTimeout(() => {
    errorMessage.value = '';
  }, 5000);
};

// ===== Checkout =====

const handleCheckout = async () => {
  clearMessages();

  // Cart validation
  if (cart.items.length === 0) {
    showError('Your cart is empty.');
    return;
  }

  // Customer validation
  if (!customerInfo.value.email.trim() || !customerInfo.value.name.trim()) {
    showError('Please fill in all required fields.');
    return;
  }

  // Validate product IDs
  const invalidItem = cart.items.find(item => !item.productId);
  if (invalidItem) {
    showError('One or more products are invalid. Please refresh your cart and try again.');
    return;
  }

  isProcessing.value = true;

  try {
    /**
     * IMPORTANT:
     * This body matches your current API:
     *
     * {
     *   items: CartItem[],
     *   userId?: string
     * }
     */
    const response = await $fetch<{
      url?: string;
    }>('/api/stripe/checkout', {
      method: 'POST',

      body: {
        items: cart.items.map(item => ({
          productId: String(item.productId ?? ''),
          name: String(item.name),
          price: Number(item.price),
          quantity: Number(item.quantity),
          imageUrl: item.imageUrl ? String(item.imageUrl) : undefined,
        })),

        userId: 'guest-user',
      },
    });

    if (!response?.url) {
      throw new Error('No Stripe checkout URL received.');
    }

    // Redirect to Stripe Checkout
    window.location.href = response.url;
  } catch (error: any) {
    console.error('❌ Checkout failed:', error);

    const message =
      error?.data?.statusMessage ||
      error?.statusMessage ||
      error?.message ||
      'Checkout failed. Please try again.';

    showError(message);
  } finally {
    isProcessing.value = false;
  }
};

// ===== Lifecycle =====

onMounted(() => {
  // Stripe payment successful
  if (route.query.success === 'true') {
    successMessage.value = 'Payment successful! Thank you for your order.';

    // Clear cart after returning from Stripe
    cart.clearCart();

    setTimeout(() => {
      successMessage.value = '';
    }, 5000);
  }

  // Stripe payment canceled
  if (route.query.canceled === 'true') {
    errorMessage.value = 'Payment was canceled. Please try again.';

    setTimeout(() => {
      errorMessage.value = '';
    }, 5000);
  }
});

// ===== SEO =====

useSeoMeta({
  title: 'Checkout - Protesk Store',
  description: 'Complete your purchase securely with Stripe.',
});
</script>
