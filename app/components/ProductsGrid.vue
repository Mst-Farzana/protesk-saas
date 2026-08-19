<template>
  <div>
    <p
      class="mb-3 rounded-lg bg-red-100 p-2 text-sm font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400"
    >
      📦 Products count: {{ products.length }}
    </p>

    <div class="grid gap-4 md:grid-cols-3">
      <div
        v-for="p in products"
        :key="p.id"
        class="rounded-xl border border-slate-200 p-3 dark:border-slate-800"
      >
        <img
          v-if="p.imageUrl"
          :src="p.imageUrl ?? ''"
          :alt="p.name ?? ''"
          class="h-40 w-full rounded-lg object-cover"
        />
        <p class="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
          {{ p.name }}
        </p>
        <p class="text-xs text-cyan-600 dark:text-cyan-400">{{ p.category }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useProducts } from '~/composables/useProducts';

const { products, load } = useProducts();

onMounted(() => {
  load();
});
</script>
