<template>
  <div class="bg-white dark:bg-slate-950">
    <!-- Hero -->
    <section class="relative overflow-hidden py-16">
      <!-- Light Mode Background -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-white dark:hidden"
      />

      <!-- Dark Mode Background -->
      <div
        class="hidden absolute inset-0 bg-gradient-to-br from-[#071630] via-[#0a2242] to-[#0e2f5a] dark:block"
      />

      <!-- Glow Effect (Light) -->
      <div
        class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl dark:hidden"
      />

      <!-- Glow Effect (Dark) -->
      <div
        class="pointer-events-none hidden absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl dark:block"
      />

      <div class="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <span
          class="inline-flex items-center gap-2 rounded-full border border-cyan-600/30 bg-cyan-100 px-4 py-1.5 text-xs font-medium text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-300"
        >
          📦 Real-time Status
        </span>
        <h1 class="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          Track Your Order
        </h1>
        <p class="mx-auto mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
          Enter your Order ID to see live status updates of your purchase.
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <!-- Form -->
      <form
        class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
        @submit.prevent="trackOrder"
      >
        <label class="text-sm font-medium text-slate-700 dark:text-slate-300" for="orderId">
          Order ID
        </label>
        <div class="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id="orderId"
            v-model="orderId"
            type="text"
            required
            placeholder="e.g. ord_1a2b3c4d"
            class="flex-1 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
          />
          <button
            type="submit"
            :disabled="pending"
            class="rounded-full bg-cyan-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-500 dark:hover:bg-cyan-400"
          >
            {{ pending ? 'Tracking...' : 'Track Order' }}
          </button>
        </div>
      </form>

      <!-- Error -->
      <div
        v-if="error"
        class="mt-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-400"
      >
        <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {{ error }}
      </div>

      <!-- Result -->
      <div v-if="order" class="mt-8 space-y-6">
        <!-- Summary -->
        <div
          class="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-3"
        >
          <div>
            <p class="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Order Date
            </p>
            <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {{
                new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              }}
            </p>
          </div>
          <div>
            <p class="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Amount
            </p>
            <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              ${{ Number(order.totalAmount).toFixed(2) }}
            </p>
          </div>
          <div>
            <p class="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Status
            </p>
            <span
              class="mt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
              :class="statusClasses"
            >
              <svg v-if="statusIcon" class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ order.status }}
            </span>
          </div>
        </div>

        <!-- Cancelled Banner -->
        <div
          v-if="isCancelled"
          class="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-400"
        >
          This order has been cancelled. If you have questions, please contact support.
        </div>

        <!-- Timeline -->
        <div
          v-else
          class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8"
        >
          <h2
            class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Delivery Progress
          </h2>
          <ol class="relative ml-5 mt-8 border-l-2 border-slate-200 dark:border-slate-700">
            <li v-for="(step, i) in steps" :key="step.title" class="mb-10 ml-8 last:mb-0">
              <span
                class="absolute -left-[1.25rem] flex h-10 w-10 items-center justify-center rounded-full ring-4 ring-white dark:ring-slate-950"
                :class="
                  i <= statusIndex
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                "
              >
                <svg
                  v-if="i < statusIndex"
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span v-else class="text-sm font-bold">{{ i + 1 }}</span>
              </span>
              <div class="-mt-1.5">
                <p
                  class="font-semibold"
                  :class="
                    i <= statusIndex
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-400 dark:text-slate-500'
                  "
                >
                  {{ step.title }}
                </p>
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ step.sub }}</p>
              </div>
            </li>
          </ol>
        </div>

        <!-- Order Items -->
        <div
          v-if="order.items && order.items.length"
          class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8"
        >
          <h2
            class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Order Items
          </h2>
          <div class="mt-4 space-y-3">
            <div
              v-for="(item, idx) in order.items"
              :key="idx"
              class="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4 dark:border-slate-800"
            >
              <div class="flex items-center gap-3">
                <NuxtImg
                  v-if="item.imageUrl"
                  :src="item.imageUrl"
                  :alt="item.name"
                  class="h-12 w-12 rounded-lg object-cover"
                />
                <div>
                  <p class="font-semibold text-slate-900 dark:text-white">{{ item.name }}</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400">
                    Qty: {{ item.quantity }} × ${{ Number(item.price).toFixed(2) }}
                  </p>
                </div>
              </div>
              <p class="font-bold text-slate-900 dark:text-white">
                ${{ (Number(item.price) * Number(item.quantity || 1)).toFixed(2) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="!order && !pending && !error && orderId.trim()"
        class="mt-8 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center dark:border-slate-800 dark:bg-slate-900/50"
      >
        <svg
          class="mx-auto h-12 w-12 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
        <h3 class="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No order found</h3>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Please check your Order ID and try again. If you have questions, contact our support team.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Track Order | Protesk' });

const route = useRoute();
const orderId = ref('');
const order = ref<any>(null);
const error = ref('');
const pending = ref(false);

const steps = [
  { title: 'Order Placed', sub: 'We have received your order' },
  { title: 'Confirmed', sub: 'Payment verified & order processed' },
  { title: 'Shipped', sub: 'Your package is on the way' },
  { title: 'Delivered', sub: 'Package delivered to your address' },
];

const statusIndex = computed(() => {
  const s = (order.value?.status || '').toLowerCase();
  if (['pending', 'placed', 'unpaid'].includes(s)) return 0;
  if (['confirmed', 'processing', 'paid'].includes(s)) return 1;
  if (['shipped', 'out_for_delivery'].includes(s)) return 2;
  if (['delivered', 'completed'].includes(s)) return 3;
  return 0;
});

const isCancelled = computed(() => (order.value?.status || '').toLowerCase().includes('cancel'));

const statusClasses = computed(() => {
  const s = (order.value?.status || '').toLowerCase();
  if (isCancelled.value) return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
  if (['delivered', 'completed'].includes(s))
    return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  if (['shipped', 'out_for_delivery'].includes(s))
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
  if (['confirmed', 'processing', 'paid'].includes(s))
    return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400';
  return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
});

const statusIcon = computed(() => {
  const s = (order.value?.status || '').toLowerCase();
  return ['delivered', 'completed', 'confirmed', 'paid'].includes(s);
});

const trackOrder = async () => {
  const id = orderId.value.trim();
  if (!id) return;
  pending.value = true;
  error.value = '';
  order.value = null;
  try {
    const res: any = await $fetch('/api/orders/track', { query: { orderId: id } });
    order.value = res?.data ?? res;
  } catch (e: any) {
    error.value =
      e?.data?.statusMessage ||
      e?.data?.message ||
      'Order not found. Please check your Order ID and try again.';
  } finally {
    pending.value = false;
  }
};

// ✅ Auto-fill from query parameter (Admin → Track Order)
onMounted(() => {
  const queryId = route.query.id as string;
  if (queryId) {
    orderId.value = queryId;
    // Auto-track after a short delay
    setTimeout(() => {
      trackOrder();
    }, 300);
  }
});
</script>
