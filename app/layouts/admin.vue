<template>
  <div class="flex min-h-screen bg-slate-100 dark:bg-slate-950">
    <button
      class="fixed top-4 left-4 z-50 rounded-lg bg-white p-2 shadow-lg lg:hidden dark:bg-slate-800"
      aria-label="Toggle menu"
      @click="sidebarOpen = !sidebarOpen"
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
      @click="sidebarOpen = false"
    />

    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
      aria-label="Admin navigation"
    >
      <div
        class="flex h-16 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-800"
      >
        <NuxtLink to="/admin" class="text-lg font-bold text-blue-600 dark:text-blue-400">
          Protesk Admin
        </NuxtLink>
      </div>

      <nav class="space-y-1 p-4">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          active-class="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
          @click="sidebarOpen = false"
        >
          {{ item.label }}
        </NuxtLink>

        <button
          type="button"
          class="mt-4 flex w-full items-center justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-900/20 dark:hover:text-red-300"
          @click="handleLogout"
        >
          Logout
        </button>
      </nav>
    </aside>

    <div class="flex flex-1 flex-col">
      <header
        role="banner"
        class="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 sm:px-6"
      >
        <h1 class="text-lg font-semibold text-slate-900 dark:text-white">
          {{ pageTitle }}
        </h1>
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/"
            class="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            View Store
          </NuxtLink>
          <UiDarkMode />
        </div>
      </header>

      <main
        id="main-content"
        role="main"
        class="flex-1 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-950 sm:p-6 lg:p-8"
      >
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { navigateTo, useSupabaseClient } from '#imports';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const route = useRoute();
const auth = useAuthStore();
const supabase = useSupabaseClient();

const navItems = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Products', to: '/admin/products' },
  { label: 'Orders', to: '/admin/orders' },
  { label: 'Transactions', to: '/admin/transactions' },
  { label: 'Categories', to: '/admin/categories' },
];

const pageTitle = computed(() => {
  const match = navItems.find(item => item.to === route.path);
  return match?.label ?? 'Admin Panel';
});

const sidebarOpen = ref(false);

onMounted(async () => {
  if (!auth.isAuthenticated) {
    await navigateTo('/login');
  }
});

const handleLogout = async () => {
  try {
    await supabase.auth.signOut();
  } finally {
    auth.clearUser();
    await navigateTo('/login');
  }
};
</script>
