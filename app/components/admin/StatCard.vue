<template>
  <div
    class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
  >
    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
      {{ label }}
    </p>
    <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
      <span v-if="loading" class="inline-block h-8 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <span v-else>{{ value }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  loading?: boolean
}>()
</script>
