<!-- pages/order-success.vue -->
<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
  >
    <div class="text-center max-w-md px-6">
      <!-- Success Icon -->
      <div
        class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
      >
        <svg
          class="h-12 w-12 text-green-600 dark:text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Payment Successful! 🎉</h1>

      <p class="text-lg text-gray-600 dark:text-gray-300 mb-2">Thank you for your order!</p>

      <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Your order has been confirmed. You'll receive an email confirmation shortly.
      </p>

      <!-- Session ID (যদি query-তে থাকে) -->
      <div v-if="sessionId" class="mb-6 rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Order Reference:</p>
        <p class="font-mono text-sm text-gray-900 dark:text-white">{{ sessionId }}</p>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <NuxtLink
          to="/"
          class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition"
        >
          Continue Shopping
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

// Session ID শুধু display এর জন্য — কোনো API call নয়
const sessionId = computed(() => String(route.query.session_id || ''));

useSeoMeta({
  title: 'Order Successful - Protesk Store',
  description: 'Your payment has been processed successfully.',
});
</script>
