<template>
  <div>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Orders</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Manage customer orders • {{ pagination.total }} total orders
        </p>
      </div>
    </div>

    <!-- Filters -->
    <div class="mt-6 flex flex-wrap gap-3">
      <button
        v-for="s in statusFilters"
        :key="s.value"
        :class="[
          'rounded-full px-4 py-2 text-sm font-medium transition',
          selectedStatus === s.value
            ? 'bg-cyan-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
        ]"
        @click="selectedStatus = s.value"
      >
        {{ s.label }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="mt-6 text-center text-gray-500">Loading orders...</div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="mt-6 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/30 dark:text-red-200"
    >
      Failed to load orders: {{ error.message }}
    </div>

    <!-- Orders Table -->
    <div v-else class="mt-6 overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Order ID
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Customer
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Items</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Amount</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          <tr v-if="orders.length === 0">
            <td colspan="7" class="px-6 py-8 text-center text-gray-500">No orders found</td>
          </tr>
          <tr v-for="order in orders" v-else :key="order.id">
            <td
              class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white"
            >
              #{{ order.id.slice(0, 8).toUpperCase() }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm">
              <div class="text-gray-900 dark:text-white">
                {{ order.user?.name || 'Guest' }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ order.user?.email || 'N/A' }}
              </div>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
              {{ order.itemCount }} item{{ order.itemCount > 1 ? 's' : '' }}
              <div class="text-xs text-gray-400">{{ order.firstItemName }}</div>
            </td>
            <td
              class="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white"
            >
              ${{ Number(order.totalAmount || 0).toFixed(2) }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm">
              <select
                :value="order.status"
                class="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                @change="updateStatus(order.id, ($event.target as HTMLSelectElement).value)"
              >
                <option v-for="s in statusFilters" :key="s.value" :value="s.value">
                  {{ s.label }}
                </option>
              </select>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
              {{ new Date(order.createdAt).toLocaleDateString() }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm">
              <NuxtLink
                :to="`/products/track-order?id=${order.id}`"
                class="text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300"
              >
                View Details
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div
        v-if="pagination.totalPages > 1"
        class="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3 dark:border-gray-700 dark:bg-gray-800"
      >
        <button
          :disabled="pagination.page === 1"
          class="rounded-md bg-gray-100 px-3 py-1 text-sm disabled:opacity-50 dark:bg-gray-700"
          @click="pagination.page--"
        >
          Previous
        </button>
        <span class="text-sm text-gray-600 dark:text-gray-400">
          Page {{ pagination.page }} of {{ pagination.totalPages }}
        </span>
        <button
          :disabled="pagination.page === pagination.totalPages"
          class="rounded-md bg-gray-100 px-3 py-1 text-sm disabled:opacity-50 dark:bg-gray-700"
          @click="pagination.page++"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});

interface Order {
  id: string;
  userId: string | null;
  totalAmount: number | string | null;
  status: string;
  createdAt: string | Date;
  user: { name: string; email: string } | null;
  itemCount: number;
  firstItemName: string;
}

const statusFilters = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Paid', value: 'PAID' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Shipped', value: 'SHIPPED' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

const selectedStatus = ref('');
const pagination = reactive({
  page: 1,
  limit: 50,
  total: 0,
  totalPages: 1,
});

// ✅ Fetch orders with filters
const { data, pending, error, refresh } = await useFetch('/api/orders', {
  query: computed(() => ({
    status: selectedStatus.value,
    page: pagination.page,
    limit: pagination.limit,
  })),
  watch: [selectedStatus, () => pagination.page],
});

const orders = computed<Order[]>(() => {
  const res = data.value as any;
  if (!res) return [];

  // Update pagination info
  if (res.pagination) {
    pagination.total = res.pagination.total;
    pagination.totalPages = res.pagination.totalPages;
  }

  if (Array.isArray(res)) return res;
  return Array.isArray(res.data) ? res.data : [];
});

// ✅ Reset to page 1 when filter changes
watch(selectedStatus, () => {
  pagination.page = 1;
});

// ✅ Update order status
const updateStatus = async (orderId: string, newStatus: string) => {
  try {
    await $fetch(`/api/orders/${orderId}`, {
      // @ts-expect-error - typed routes stale hote pare
      method: 'PUT',
      body: { status: newStatus },
    });
    await refresh();
  } catch (err) {
    console.error('Failed to update status:', err);
    alert('Failed to update order status');
  }
};

useSeoMeta({
  title: 'Orders - Admin - Protesk',
});
</script>
