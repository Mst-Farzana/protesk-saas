<template>
  <div class="bg-white dark:bg-slate-950">
    <!-- Hero -->
    <section class="relative overflow-hidden py-20">
      <!-- Light Mode Background -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-white dark:hidden"
      />
      <div
        class="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl dark:hidden"
      />
      <div
        class="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl dark:hidden"
      />

      <!-- Dark Mode Background -->
      <div
        class="hidden absolute inset-0 bg-gradient-to-br from-[#071630] via-[#0a2242] to-[#0e2f5a] dark:block"
      />
      <div
        class="pointer-events-none hidden absolute -left-24 -top-24 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl dark:block"
      />
      <div
        class="pointer-events-none hidden absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl dark:block"
      />

      <div class="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <span
          class="inline-flex items-center gap-2 rounded-full border border-cyan-600/30 bg-cyan-100 px-4 py-1.5 text-xs font-medium text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-300"
        >
          Our Story
        </span>
        <h1
          class="mx-auto mt-4 max-w-3xl text-3xl font-extrabold text-slate-900 dark:text-white sm:text-5xl"
        >
          Building the Future of
          <span
            class="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-blue-500"
          >
            Modern Commerce
          </span>
        </h1>
        <p
          class="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-7"
        >
          Protesk is a modern e-commerce platform from Bangladesh, designed to make premium tech
          accessible to everyone — with secure payments, fast delivery and a customer-first mindset.
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <NuxtLink
            to="/"
            class="rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400"
          >
            Shop Now
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-500 hover:text-cyan-600 dark:border-slate-500/60 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
          >
            Contact Us
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div
        class="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 text-center sm:px-6 lg:grid-cols-4 lg:px-8"
      >
        <div v-for="s in stats" :key="s.label">
          <p class="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">{{ s.value }}</p>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ s.label }}</p>
        </div>
      </div>
    </section>

    <!-- Mission / Vision -->
    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="grid gap-6 md:grid-cols-2">
        <div
          class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div
            class="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 class="mt-5 text-xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
          <p class="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            To make premium technology products accessible to everyone with a seamless shopping
            experience, transparent pricing and reliable after-sales support.
          </p>
        </div>
        <div
          class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div
            class="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
          <h2 class="mt-5 text-xl font-bold text-slate-900 dark:text-white">Our Vision</h2>
          <p class="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            To become the most trusted tech marketplace in the region — powered by secure FinTech
            infrastructure and a unified commerce experience for customers and admins alike.
          </p>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="bg-slate-50 py-16 dark:bg-slate-900/50">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 class="text-center text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Our Core Values
        </h2>
        <p class="mx-auto mt-3 max-w-xl text-center text-sm text-slate-500 dark:text-slate-400">
          The principles that guide every decision we make.
        </p>
        <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="v in values"
            :key="v.title"
            class="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <div
              class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="v.icon" />
              </svg>
            </div>
            <h3 class="mt-4 font-semibold text-slate-900 dark:text-white">{{ v.title }}</h3>
            <p class="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{{ v.sub }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Why Choose Protesk?
          </h2>
          <p class="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
            We combine a carefully curated product catalog with enterprise-grade security and a
            FinTech-ready admin panel, so every order is fast, safe and transparent.
          </p>
          <ul class="mt-6 space-y-4">
            <li v-for="item in highlights" :key="item" class="flex items-start gap-3">
              <svg
                class="mt-0.5 h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="text-sm text-slate-700 dark:text-slate-300">{{ item }}</span>
            </li>
          </ul>
        </div>

        <!-- ✅ Quote Card (একবারই, সঠিক structure) -->
        <div
          class="relative overflow-hidden rounded-2xl border border-slate-200 shadow-xl text-black dark:border-cyan-500/25 dark:shadow-cyan-500/10 dark:text-slate-400"
        >
          <!-- Light Mode Background -->
          <div class="absolute inset-0 bg-white dark:hidden" />
          <!-- Dark Mode Background -->
          <div
            class="hidden absolute inset-0 bg-gradient-to-br from-[#0a2242] via-[#0c2a52] to-[#0e2f5a] dark:block"
          />
          <!-- Decorative Blur -->
          <div
            class="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/20"
          />

          <div class="relative p-10">
            <p class="text-lg font-semibold leading-7 text-black dark:text-white">
              "We don't just sell products — we build long-term trust with every customer."
            </p>
            <p class="mt-4 text-sm text-black/70 dark:text-slate-400">— The Protesk Team</p>
            <div class="mt-8 grid grid-cols-2 gap-4 text-center">
              <div
                class="rounded-xl bg-slate-100 p-4 backdrop-blur-sm dark:bg-white/5 dark:ring-1 dark:ring-cyan-500/20"
              >
                <p class="text-2xl font-bold text-black dark:text-cyan-400">100%</p>
                <p class="text-xs text-black/70 dark:text-slate-400">Secure Payments</p>
              </div>
              <div
                class="rounded-xl bg-slate-100 p-4 backdrop-blur-sm dark:bg-white/5 dark:ring-1 dark:ring-cyan-500/20"
              >
                <p class="text-2xl font-bold text-black dark:text-cyan-400">24/7</p>
                <p class="text-xs text-black/70 dark:text-slate-400">Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ✅ CTA -->
    <!-- ✅ CTA -->
    <section class="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div
        class="relative overflow-hidden rounded-2xl border border-slate-200 shadow-xl text-black dark:border-cyan-500/25 dark:shadow-cyan-500/10"
      >
        <!-- Single background — light/dark এক element এ switch হবে -->
        <div
          class="absolute inset-0 bg-white dark:bg-gradient-to-br dark:from-[#071630] dark:via-[#0a2242] dark:to-[#0e2f5a]"
        />
        <!-- Glow Effect -->
        <div
          class="pointer-events-none absolute -bottom-16 left-1/2 h-48 w-[120%] -translate-x-1/2 bg-cyan-500/10 blur-3xl"
        />

        <div class="relative p-10 text-center">
          <h2 class="text-2xl font-bold text-black sm:text-3xl dark:text-slate-300">
            Ready to experience Protesk?
          </h2>
          <p class="mx-auto mt-3 max-w-xl text-sm text-black dark:text-slate-300">
            Browse our curated collection of premium tech products today.
          </p>
          <NuxtLink
            to="/"
            class="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50 dark:border-transparent dark:bg-gradient-to-r dark:from-cyan-500 dark:to-teal-400 dark:text-slate-950 dark:shadow-[0_0_24px_rgba(45,212,191,0.35)] dark:hover:from-cyan-400 dark:hover:to-teal-300"
          >
            Start Shopping
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'About Us | Protesk' });

const stats = [
  { value: '1000+', label: 'Orders Delivered' },
  { value: '500+', label: 'Happy Customers' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '24/7', label: 'Customer Support' },
];

const values = [
  {
    title: 'Premium Quality',
    sub: 'Every product is hand-picked and quality checked before listing.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    title: 'Secure Payments',
    sub: 'Stripe-powered checkout with bank-level encryption.',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  },
  {
    title: 'Customer First',
    sub: 'Your satisfaction drives every decision we make.',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  },
  {
    title: 'Fast Delivery',
    sub: 'Quick dispatch and reliable delivery partners nationwide.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
];

const highlights = [
  'Curated catalog of premium tech products',
  'Stripe-secured checkout & transparent pricing',
  'Unified admin panel for orders, stock & payments',
  '7-day easy return policy on all products',
  'Dedicated support via email, phone & WhatsApp',
];
</script>
