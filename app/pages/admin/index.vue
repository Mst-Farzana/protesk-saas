<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p class="mt-2 text-slate-600 dark:text-slate-400">
          Welcome back! Here's your store overview.
        </p>
      </div>
      <select
        v-model="days"
        class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      >
        <option :value="7">Last 7 days</option>
        <option :value="14">Last 14 days</option>
        <option :value="30">Last 30 days</option>
      </select>
    </div>

    <!-- ✅ Stats Grid (with Increase/Decrease) -->
    <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <template v-if="!loading">
        <div
          v-for="s in cards"
          :key="s.label"
          class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div class="flex items-center justify-between gap-2">
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ s.label }}</p>
            <span
              v-if="s.change !== null"
              class="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold"
              :class="
                s.change >= 0
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
              "
            >
              <svg
                class="h-3 w-3"
                :class="s.change < 0 ? 'rotate-180' : ''"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M5 15l7-7 7 7"
                />
              </svg>
              {{ s.change >= 0 ? '+' : '' }}{{ s.change }}%
            </span>
            <span
              v-else-if="s.badge"
              class="rounded-full px-2 py-0.5 text-xs font-bold"
              :class="s.badgeClass"
            >
              {{ s.badge }}
            </span>
          </div>
          <p class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{{ s.value }}</p>
          <p class="mt-1 text-xs text-slate-400 dark:text-slate-500">{{ s.sub }}</p>
        </div>
      </template>
      <div
        v-else
        v-for="i in 4"
        :key="i"
        class="h-28 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800"
      />
    </div>

    <!-- ✅ Charts -->
    <div class="mt-8 grid gap-6 lg:grid-cols-2">
      <!-- Revenue Area Chart -->
      <div
        class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div class="flex items-center justify-between">
          <h2 class="font-bold text-slate-900 dark:text-white">Revenue</h2>
          <span class="text-xs text-slate-400">per day</span>
        </div>
        <svg v-if="series.length" viewBox="0 0 600 220" class="mt-4 w-full">
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#06b6d4" stop-opacity="0" />
            </linearGradient>
          </defs>
          <line
            v-for="g in 3"
            :key="g"
            :x1="P"
            :x2="W - P"
            :y1="P + ((H - P * 2) * g) / 4"
            :y2="P + ((H - P * 2) * g) / 4"
            stroke-dasharray="4 4"
            class="stroke-slate-200 dark:stroke-slate-800"
          />
          <path :d="areaPath" fill="url(#revGrad)" />
          <path
            :d="linePath"
            fill="none"
            stroke="#06b6d4"
            stroke-width="3"
            stroke-linecap="round"
          />
          <circle
            v-for="(s, i) in series"
            :key="s.date"
            :cx="px(i)"
            :cy="pyRev(s.revenue)"
            r="4"
            stroke-width="2"
            class="fill-white stroke-cyan-500 dark:fill-slate-900"
          >
            <title>{{ s.label }}: ${{ s.revenue.toFixed(2) }}</title>
          </circle>
        </svg>
        <div v-if="series.length" class="mt-2 flex justify-between text-[10px] text-slate-400">
          <span>{{ series[0]?.label }}</span>
          <span>{{ series[Math.floor(series.length / 2)]?.label }}</span>
          <span>{{ series[series.length - 1]?.label }}</span>
        </div>
      </div>

      <!-- Orders Bar Chart -->
      <div
        class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div class="flex items-center justify-between">
          <h2 class="font-bold text-slate-900 dark:text-white">Orders</h2>
          <span class="text-xs text-slate-400">per day</span>
        </div>
        <svg v-if="series.length" viewBox="0 0 600 220" class="mt-4 w-full">
          <line
            v-for="g in 3"
            :key="g"
            :x1="P"
            :x2="W - P"
            :y1="P + ((H - P * 2) * g) / 4"
            :y2="P + ((H - P * 2) * g) / 4"
            stroke-dasharray="4 4"
            class="stroke-slate-200 dark:stroke-slate-800"
          />
          <rect
            v-for="(s, i) in series"
            :key="s.date"
            :x="barX(i)"
            :y="H - P - barH(s.orders)"
            :width="barW"
            :height="barH(s.orders)"
            rx="4"
            class="fill-cyan-500/80 transition hover:fill-cyan-400"
          >
            <title>{{ s.label }}: {{ s.orders }} orders</title>
          </rect>
        </svg>
        <div v-if="series.length" class="mt-2 flex justify-between text-[10px] text-slate-400">
          <span>{{ series[0]?.label }}</span>
          <span>{{ series[Math.floor(series.length / 2)]?.label }}</span>
          <span>{{ series[series.length - 1]?.label }}</span>
        </div>
      </div>
    </div>

    <!-- ✅ Quick Actions -->
    <div class="mt-8">
      <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Quick Actions</h2>
      <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <NuxtLink
          to="/admin/products"
          class="rounded-lg bg-blue-600 px-4 py-3 text-center text-white transition hover:bg-blue-700"
        >
          Manage Products
        </NuxtLink>
        <NuxtLink
          to="/admin/orders"
          class="rounded-lg bg-green-600 px-4 py-3 text-center text-white transition hover:bg-green-700"
        >
          View Orders
        </NuxtLink>
        <NuxtLink
          to="/admin/transactions"
          class="rounded-lg bg-purple-600 px-4 py-3 text-center text-white transition hover:bg-purple-700"
        >
          Transactions
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});

useSeoMeta({
  title: 'Admin Dashboard - Protesk',
  description: 'Manage your e-commerce store',
});

const days = ref(14);
const loading = ref(true);
const products = ref<any[]>([]);
const orders = ref<any[]>([]);

onMounted(async () => {
  try {
    const [p, o] = await Promise.all([$fetch<any>('/api/products'), $fetch<any>('/api/orders')]);
    products.value = Array.isArray(p) ? p : (p?.data ?? []);
    orders.value = Array.isArray(o) ? o : (o?.data ?? []);
  } catch (error) {
    console.error('Failed to fetch stats:', error);
  } finally {
    loading.value = false;
  }
});

// ✅ All calculations (current vs previous period)
const stats = computed(() => {
  const all = orders.value;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const rangeStart = new Date(startOfToday);
  rangeStart.setDate(rangeStart.getDate() - (days.value - 1));

  const prevEnd = new Date(rangeStart);
  prevEnd.setDate(prevEnd.getDate() - 1);
  prevEnd.setHours(23, 59, 59, 999);

  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - (days.value - 1));
  prevStart.setHours(0, 0, 0, 0);

  const inRange = all.filter(o => new Date(o.createdAt) >= rangeStart);
  const inPrev = all.filter(o => {
    const d = new Date(o.createdAt);
    return d >= prevStart && d <= prevEnd;
  });

  const sum = (list: any[]) => list.reduce((a, o) => a + Number(o.totalAmount || 0), 0);
  const revenue = sum(inRange);
  const prevRevenue = sum(inPrev);
  const pct = (cur: number, prev: number) =>
    prev === 0 ? (cur > 0 ? 100 : 0) : Math.round(((cur - prev) / prev) * 100);

  const series = Array.from({ length: days.value }, (_, i) => {
    const d = new Date(rangeStart);
    d.setDate(d.getDate() + i);
    const key = d.toDateString();
    const dayOrders = inRange.filter(o => new Date(o.createdAt).toDateString() === key);
    return {
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: sum(dayOrders),
      orders: dayOrders.length,
    };
  });

  return {
    products: products.value.length,
    orders: inRange.length,
    revenue,
    pending: all.filter(o => String(o.status).toUpperCase() === 'PENDING').length,
    revenueChange: pct(revenue, prevRevenue),
    ordersChange: pct(inRange.length, inPrev.length),
    series,
  };
});

// ✅ Stat cards
const cards = computed(() => [
  {
    label: 'Total Products',
    value: String(stats.value.products),
    change: null,
    badge: 'Live',
    badgeClass: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    sub: 'in your catalog',
  },
  {
    label: 'Total Orders',
    value: String(stats.value.orders),
    change: stats.value.ordersChange,
    badge: null,
    badgeClass: '',
    sub: `last ${days.value} days`,
  },
  {
    label: 'Total Revenue',
    value: '$' + stats.value.revenue.toFixed(2),
    change: stats.value.revenueChange,
    badge: null,
    badgeClass: '',
    sub: `last ${days.value} days`,
  },
  {
    label: 'Pending Orders',
    value: String(stats.value.pending),
    change: null,
    badge: 'Action needed',
    badgeClass: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    sub: 'awaiting processing',
  },
]);

const series = computed(() => stats.value.series);

// ✅ SVG chart math
const W = 600;
const H = 220;
const P = 12;

const maxRev = computed(() => Math.max(...series.value.map((s: any) => s.revenue), 1));
const maxOrd = computed(() => Math.max(...series.value.map((s: any) => s.orders), 1));

const px = (i: number) => P + (i * (W - P * 2)) / Math.max(series.value.length - 1, 1);
const pyRev = (v: number) => H - P - (v / maxRev.value) * (H - P * 2);

const linePath = computed(() =>
  series.value
    .map(
      (s: any, i: number) => `${i ? 'L' : 'M'}${px(i).toFixed(1)},${pyRev(s.revenue).toFixed(1)}`
    )
    .join(' ')
);
const areaPath = computed(() => {
  if (!series.value.length) return '';
  return `${linePath.value} L${px(series.value.length - 1).toFixed(1)},${H - P} L${px(0).toFixed(1)},${H - P} Z`;
});

const barW = computed(() => ((W - P * 2) / Math.max(series.value.length, 1)) * 0.55);
const barX = (i: number) => px(i) - barW.value / 2;
const barH = (v: number) => Math.max((v / maxOrd.value) * (H - P * 2), v > 0 ? 4 : 2);
</script>
