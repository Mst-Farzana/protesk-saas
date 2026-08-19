<template>
  <section class="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="mb-8 flex items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-semibold text-gray-900 dark:text-white">Shopping Cart</h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Review your cart before checkout.
        </p>
      </div>
      <NuxtLink
        to="/"
        class="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        Continue shopping
      </NuxtLink>
    </div>

    <div
      class="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950"
    >
      <div v-if="!cart.items.length" class="text-center text-sm text-gray-500 dark:text-gray-400">
        Your cart is empty.
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="item in cart.items"
          :key="item.productId"
          class="grid gap-4 rounded-3xl border border-gray-200 bg-gray-50 p-4 sm:grid-cols-[auto_1fr_auto] dark:border-gray-700 dark:bg-gray-900"
        >
          <!-- ✅ Product Image -->
          <div class="w-20 h-20 flex-shrink-0">
            <img
              v-if="item.imageUrl"
              :src="item.imageUrl"
              :alt="item.name"
              class="w-full h-full rounded-lg object-cover"
            >
            <div
              v-else
              class="w-full h-full rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
            >
              <svg
                class="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <!-- Product Info -->
          <div>
            <p class="font-semibold text-gray-900 dark:text-white">{{ item.name }}</p>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              ${{ item.price.toFixed(2) }} each
            </p>
          </div>

          <!-- Quantity Controls -->
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-800"
              @click="updateQuantity(item.productId, item.quantity - 1)"
            >
              -
            </button>
            <span
              class="min-w-[2rem] text-center text-sm font-semibold text-gray-900 dark:text-white"
            >
              {{ item.quantity }}
            </span>
            <button
              type="button"
              class="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-800"
              @click="updateQuantity(item.productId, item.quantity + 1)"
            >
              +
            </button>
            <button
              type="button"
              class="ml-4 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              @click="removeProduct(item.productId)"
            >
              Remove
            </button>
          </div>
        </div>

        <div
          class="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Subtotal</span>
            <span>${{ cart.totalAmount.toFixed(2) }}</span>
          </div>
          <NuxtLink
            to="/checkout"
            class="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
          >
            Go to checkout
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCartStore } from '../../stores/cart'

const cart = useCartStore()

const updateQuantity = (productId: string, quantity: number) => {
  cart.updateQuantity(productId, quantity)
}

const removeProduct = (productId: string) => {
  cart.removeProduct(productId)
}
</script>
