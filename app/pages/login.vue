<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-md space-y-8">
      <!-- Title & Link -->
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Or
          <NuxtLink
            to="/register"
            class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            create a new account
          </NuxtLink>
        </p>
      </div>

      <!-- Login Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="-space-y-px rounded-md shadow-sm">
          <!-- Email Input -->
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="relative block w-full rounded-t-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:bg-gray-900 dark:text-white dark:ring-gray-700 sm:text-sm sm:leading-6"
              placeholder="Email address"
            />
          </div>
          <!-- Password Input -->
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="relative block w-full rounded-b-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:bg-gray-900 dark:text-white dark:ring-gray-700 sm:text-sm sm:leading-6"
              placeholder="Password"
            />
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">{{ error }}</h3>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative flex w-full justify-center rounded-md bg-primary-600 px-3 py-3 text-sm font-semibold text-white hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
          >
            <span v-if="loading" class="absolute inset-y-0 left-0 flex items-center pl-3">
              <!-- Loading Spinner -->
              <svg
                class="h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </span>
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSupabaseClient } from '#imports';
import { navigateTo, useSeoMeta } from 'nuxt/app';
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth';

// লেআউট সেট করা (আপনার default লেআউট ব্যবহার করবে)
definePageMeta({
  layout: 'default',
  auth: false,
});

useSeoMeta({
  title: 'Login - Protesk',
  description: 'Sign in to your Protesk admin account.',
});

// State variables
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

// Supabase Client (Nuxt Supabase module থেকে অটো-ইমপোর্ট হয়)
const supabase = useSupabaseClient();

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (authError) {
      throw authError;
    }

    if (data.user) {
      const auth = useAuthStore();
      auth.setUser({
        id: data.user.id,
        email: data.user.email ?? '',
        name: data.user.user_metadata?.full_name ?? data.user.user_metadata?.name ?? null,
        role: (data.user.user_metadata?.role ?? 'CUSTOMER') as 'CUSTOMER' | 'ADMIN' | 'MERCHANT',
      });

      await navigateTo('/admin');
    }
  } catch (err: any) {
    // এরর মেসেজ দেখানো
    error.value = err.message || 'An unexpected error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
