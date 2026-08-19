<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
    <p class="mt-2 text-gray-600 dark:text-gray-400">View all payment transactions</p>

    <!-- ✅ NO .value - Auto unwrap by Nuxt -->
    <div v-if="pending" class="mt-6 text-center text-gray-500">Loading transactions...</div>

    <div
      v-else-if="error"
      class="mt-6 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/30 dark:text-red-200"
    >
      Failed to load transactions: {{ error.message }}
    </div>

    <div v-else class="mt-6 overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Order</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Amount</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          <tr v-if="!transactions || transactions.length === 0">
            <td colspan="5" class="px-6 py-8 text-center text-gray-500">No transactions found</td>
          </tr>
          <tr v-else v-for="tx in transactions" :key="tx.id">
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
              #{{ tx.id.slice(0, 8) }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              #{{ tx.orderId?.slice(0, 8) || 'N/A' }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
              ${{ tx.amount?.toFixed(2) || '0.00' }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm">
              <span
                :class="{
                  'rounded-full bg-green-100 px-2 py-1 text-xs text-green-800':
                    tx.status === 'SUCCESS',
                  'rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800':
                    tx.status === 'PENDING',
                  'rounded-full bg-red-100 px-2 py-1 text-xs text-red-800': tx.status === 'FAILED',
                }"
              >
                {{ tx.status }}
              </span>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              {{ new Date(tx.createdAt).toLocaleDateString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});

// ✅ useFetch - NO .value in template!
const { data: transactions, pending, error } = await useFetch('/api/transactions');

useSeoMeta({
  title: 'Transactions - Admin - Protesk',
});
</script>
