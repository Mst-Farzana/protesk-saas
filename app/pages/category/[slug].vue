<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
    <p class="mt-2 text-gray-600 dark:text-gray-400">Manage product categories</p>

    <div v-if="pending" class="mt-6 text-sm text-gray-500 dark:text-gray-400">
      Loading categories…
    </div>

    <div v-else-if="error" class="mt-6 text-sm text-red-600 dark:text-red-400">
      Failed to load categories: {{ error.message }}
    </div>

    <div v-else-if="!categories?.length" class="mt-6 text-sm text-gray-500 dark:text-gray-400">
      No categories found
    </div>

    <!-- ✅ Updated: Object properties use kora hoyeche -->
    <div v-else class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="category in categories"
        :key="category.id"
        class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white capitalize">
          {{ category.name }}
        </h3>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Slug: <code class="rounded bg-gray-100 px-1 dark:bg-gray-700">{{ category.slug }}</code>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});

// ✅ useFetch ব্যবহার করুন
const { data: categories, pending, error } = await useFetch('/api/categories');

useSeoMeta({
  title: 'Categories - Admin - Protesk',
});
</script>
