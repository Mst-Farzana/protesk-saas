<template>
  <div
    class="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 p-12"
  >
    <h1 class="mb-4 text-6xl font-bold text-white">
      {{ title }}
    </h1>
    <p class="text-2xl text-gray-200">
      {{ description }}
    </p>
    <div class="mt-8 text-xl text-white">protesk.com</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();
</script>
