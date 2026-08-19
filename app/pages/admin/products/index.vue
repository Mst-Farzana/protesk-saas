<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
      <button
        class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        @click="showCreateModal = true"
      >
        + Add Product
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="mt-6 text-center text-gray-500">Loading products...</div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="mt-6 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/30 dark:text-red-200"
    >
      Failed to load products: {{ error.message }}
    </div>

    <!-- Products Table -->
    <div v-else class="mt-6 overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Category
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Price</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Stock</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          <tr v-if="!products || products.length === 0">
            <td colspan="5" class="px-6 py-8 text-center text-gray-500">No products found</td>
          </tr>
          <tr v-else v-for="product in products" :key="product.id">
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
              {{ product.name }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              {{ product.category || '-' }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
              ${{ product.price.toFixed(2) }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm">
              <span :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'">
                {{ product.stock }}
              </span>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm">
              <button class="mr-2 text-blue-600 hover:text-blue-800" @click="editProduct(product)">
                Edit
              </button>
              <button class="text-red-600 hover:text-red-800" @click="deleteProduct(product.id)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ editingProduct ? 'Edit Product' : 'Add Product' }}
        </h2>
        <form class="mt-4 space-y-4" @submit.prevent="saveProduct">
          <input
            v-model="form.name"
            type="text"
            placeholder="Product Name"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          />
          <textarea
            v-model="form.description"
            placeholder="Description"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            rows="3"
          />
          <input
            v-model.number="form.price"
            type="number"
            step="0.01"
            placeholder="Price"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            v-model.number="form.stock"
            type="number"
            placeholder="Stock"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            v-model="form.category"
            type="text"
            placeholder="Category"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <input
            v-model="form.imageUrl"
            type="url"
            placeholder="Image URL"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <div class="flex gap-2">
            <button
              type="submit"
              class="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Save
            </button>
            <button
              type="button"
              class="flex-1 rounded-lg bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
              @click="showCreateModal = false"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '../../../../types/index';

definePageMeta({
  layout: 'admin',
});

const { data: products, pending, error, refresh } = await useFetch('/api/products');

const showCreateModal = ref(false);
const editingProduct = ref<Product | null>(null);

const form = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  imageUrl: '',
});

const editProduct = (product: Product) => {
  editingProduct.value = product;
  form.value = {
    name: product.name,
    description: product.description || '',
    price: Number(product.price) || 0,
    stock: Number(product.stock) || 0,
    category: product.category || '',
    imageUrl: product.imageUrl || '',
  };
  showCreateModal.value = true;
};

const saveProduct = async () => {
  try {
    if (editingProduct.value) {
      await $fetch(`/api/products/${editingProduct.value.id}`, {
        method: 'PUT',
        body: form.value,
      });
    } else {
      await $fetch('/api/products', {
        method: 'POST',
        body: form.value,
      });
    }
    showCreateModal.value = false;
    editingProduct.value = null;
    form.value = { name: '', description: '', price: 0, stock: 0, category: '', imageUrl: '' };
    await refresh();
  } catch (err) {
    console.error('Failed to save product:', err);
  }
};

const deleteProduct = async (id: string) => {
  if (!confirm('Are you sure you want to delete this product?')) return;
  try {
    await $fetch(`/api/products/${id}`, { method: 'DELETE' });
    await refresh();
  } catch (err) {
    console.error('Failed to delete product:', err);
  }
};

useSeoMeta({
  title: 'Products - Admin - Protesk',
});
</script>
