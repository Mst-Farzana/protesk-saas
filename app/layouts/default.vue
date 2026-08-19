<template>
  <div class="flex min-h-screen flex-col bg-white dark:bg-slate-950">
    <header
      role="banner"
      class="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95"
    >
      <div
        class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <!-- Logo -->
        <NuxtLink to="/" class="flex shrink-0 items-center gap-2" aria-label="Protesk home">
          <img
          src="/logo.png"
          alt="Protesk logo"
          width="36"
          height="36"
          class="h-10 w-10 object-contain"
        />
          <span class="hidden text-lg font-semibold text-cyan-600 dark:text-cyan-400 sm:block">
            Protesk
          </span>
        </NuxtLink>

        <!-- ✅ Desktop Nav -->
        <nav aria-label="Main navigation" class="hidden items-center gap-6 lg:flex">
          <NuxtLink
            to="/"
            class="text-sm font-medium transition hover:text-cyan-600 dark:hover:text-cyan-400"
            :class="
              isShop ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-600 dark:text-slate-300'
            "
          >
            Shop
          </NuxtLink>

          <!-- ✅ Categories Dropdown -->
          <div class="group relative">
            <button
              type="button"
              class="flex items-center gap-1 text-sm font-medium text-slate-600 transition hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400"
            >
              Categories
              <svg
                class="h-4 w-4 transition group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              class="invisible absolute left-0 top-full z-50 w-48 rounded-2xl border border-slate-200 bg-white py-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 dark:border-slate-700 dark:bg-slate-900"
            >
              <NuxtLink
                v-for="c in categories"
                :key="c"
                :to="`/category/${c.toLowerCase()}`"
                class="block px-4 py-2.5 text-sm text-slate-600 transition hover:bg-cyan-50 hover:text-cyan-600 dark:text-slate-300 dark:hover:bg-cyan-900/20 dark:hover:text-cyan-400"
              >
                {{ c }}
              </NuxtLink>
            </div>
          </div>

          <NuxtLink
            to="/products/track-order"
            class="text-sm font-medium text-slate-600 transition hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400"
          >
            Track Order
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="text-sm font-medium text-slate-600 transition hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400"
          >
            About
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="text-sm font-medium text-slate-600 transition hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400"
          >
            Contact
          </NuxtLink>
        </nav>

        <!-- ✅ Right Side: Search + Wishlist + Cart + Auth -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Search -->
          <form class="relative hidden md:block" @submit.prevent="goSearch">
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search products..."
              class="w-40 rounded-full border border-slate-200 bg-white px-4 py-1.5 pr-9 text-sm text-slate-900 placeholder-slate-400 transition-all focus:w-56 focus:border-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-cyan-400"
            />
            <button
              type="submit"
              aria-label="Search"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                />
              </svg>
            </button>
          </form>

          <!-- Wishlist -->
          <NuxtLink
            to="/wishlist"
            aria-label="Wishlist"
            class="relative rounded-full p-2 text-slate-600 transition hover:text-red-500 dark:text-slate-300 dark:hover:text-red-400"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span
              v-if="wishlist.count > 0"
              class="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
            >
              {{ wishlist.count }}
            </span>
          </NuxtLink>

          <!-- Cart -->
          <NuxtLink
            to="/cart"
            aria-label="Cart"
            class="relative rounded-full p-2 text-slate-600 transition hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span
              v-if="cart.itemCount > 0"
              class="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-cyan-500 px-1 text-[10px] font-bold text-white"
            >
              {{ cart.itemCount }}
            </span>
          </NuxtLink>

          <!-- ✅ Auth Button - Smart (Account/Login) -->
          <NuxtLink
            :to="isAuthenticated ? '/account' : '/login'"
            class="hidden items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-500 hover:text-cyan-600 dark:border-slate-600/70 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-300 sm:flex"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>{{ isAuthenticated ? 'Account' : 'Login' }}</span>
          </NuxtLink>

          <UiDarkMode />

          <!-- ✅ Mobile Hamburger -->
          <button
            type="button"
            aria-label="Toggle menu"
            class="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
            @click="mobileOpen = !mobileOpen"
          >
            <svg
              v-if="!mobileOpen"
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- ✅ Mobile Menu -->
      <div
        v-if="mobileOpen"
        class="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:hidden"
      >
        <div class="space-y-1 px-4 py-4">
          <form class="relative mb-3" @submit.prevent="goSearch">
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search products..."
              class="w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder-slate-500"
            />
          </form>

          <NuxtLink
            to="/"
            class="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            @click="mobileOpen = false"
            >Shop</NuxtLink
          >

          <p
            class="px-3 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500"
          >
            Categories
          </p>
          <NuxtLink
            v-for="c in categories"
            :key="c"
            :to="`/category/${c.toLowerCase()}`"
            class="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            @click="mobileOpen = false"
          >
            {{ c }}
          </NuxtLink>

          <NuxtLink
            to="/track-order"
            class="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            @click="mobileOpen = false"
            >Track Order</NuxtLink
          >
          <NuxtLink
            to="/about"
            class="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            @click="mobileOpen = false"
            >About</NuxtLink
          >
          <NuxtLink
            to="/contact"
            class="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            @click="mobileOpen = false"
            >Contact</NuxtLink
          >
          <NuxtLink
            to="/wishlist"
            class="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            @click="mobileOpen = false"
            >Wishlist</NuxtLink
          >

          <div class="border-t border-slate-200 pt-3 dark:border-slate-800">
            <NuxtLink
              :to="isAuthenticated ? '/account' : '/login'"
              class="block rounded-lg px-3 py-2 text-sm font-medium text-cyan-600 dark:text-cyan-400"
              @click="mobileOpen = false"
            >
              {{ isAuthenticated ? 'Account' : 'Login' }}
            </NuxtLink>
            <button
              v-if="isAuthenticated"
              type="button"
              class="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              @click="handleLogout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <main id="main-content" role="main" class="flex-1 bg-white dark:bg-slate-950">
      <slot />
    </main>

    <!-- ✅ Footer -->
    <footer
      role="contentinfo"
      class="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#071630] dark:to-[#0a2242]"
    >
      <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <!-- Brand + Social Icons -->
          <div>
            <NuxtLink to="/" class="inline-flex items-center gap-2" aria-label="Protesk home">
              <img
              src="/logo.png"
              alt="Protesk logo"
              width="36"
              height="36"
              class="h-10 w-10 object-contain"
            />
              <span class="text-lg font-semibold text-cyan-600 dark:text-cyan-400">Protesk</span>
            </NuxtLink>
            <p class="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Modern E-commerce, FinTech-Ready. Shop with confidence and manage orders, products &
              payments from a unified admin panel.
            </p>

            <div class="mt-6 flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition hover:-translate-y-0.5 hover:border-blue-500 hover:text-blue-600 dark:border-slate-600/60 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition hover:-translate-y-0.5 hover:border-sky-500 hover:text-sky-600 dark:border-slate-600/60 dark:text-slate-300 dark:hover:border-sky-400 dark:hover:text-sky-400"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                  />
                </svg>
              </a>

              <a
                href="mailto:support@protesk.com"
                aria-label="Gmail"
                class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition hover:-translate-y-0.5 hover:border-red-500 hover:text-red-600 dark:border-slate-600/60 dark:text-slate-300 dark:hover:border-red-400 dark:hover:text-red-400"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
                  />
                </svg>
              </a>

              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition hover:-translate-y-0.5 hover:border-green-500 hover:text-green-600 dark:border-slate-600/60 dark:text-slate-300 dark:hover:border-green-500 dark:hover:text-green-400"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                  />
                </svg>
              </a>
            </div>
          </div>

          <!-- Pages -->
          <div>
            <h3
              class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 dark:text-white"
            >
              Pages
            </h3>
            <ul class="mt-4 space-y-3 text-sm">
              <li>
                <NuxtLink
                  to="/"
                  class="text-slate-600 transition hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300"
                  >Shop</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/admin"
                  class="text-slate-600 transition hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300"
                >
                  Admin Panel
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/login"
                  class="text-slate-600 transition hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300"
                >
                  Login
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/track-order"
                  class="text-slate-600 transition hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300"
                >
                  Track Order
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/wishlist"
                  class="text-slate-600 transition hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300"
                >
                  Wishlist
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h3
              class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 dark:text-white"
            >
              Support
            </h3>
            <ul class="mt-4 space-y-3 text-sm">
              <!-- ✅ NEW: Support Inbox Button -->
              <li>
                <button
                  type="button"
                  class="group flex items-center gap-2 font-medium text-cyan-600 transition hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
                  @click="openSupportChat"
                >
                  <span class="relative flex h-2 w-2">
                    <span
                      class="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"
                    />
                    <span class="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
                  </span>
                  Support Inbox
                  <svg
                    class="h-3.5 w-3.5 transition group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </button>
              </li>
              <li>
                <a
                  href="#"
                  class="text-slate-600 transition hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300"
                  >FAQ</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-slate-600 transition hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300"
                  >Privacy Policy</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-slate-600 transition hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300"
                  >Terms & Conditions</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-slate-600 transition hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300"
                  >Refund Policy</a
                >
              </li>
            </ul>
          </div>

          <!-- Contact Us -->
          <div>
            <h3
              class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 dark:text-white"
            >
              Contact Us
            </h3>
            <ul class="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li class="flex items-start gap-3">
                <svg
                  class="mt-0.5 h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <span>Dhaka, Bangladesh</span>
              </li>
              <li>
                <a
                  href="mailto:support@protesk.com"
                  class="flex items-center gap-3 transition hover:text-cyan-600 dark:hover:text-cyan-300"
                >
                  <svg
                    class="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                  support@protesk.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+8801700000000"
                  class="flex items-center gap-3 transition hover:text-cyan-600 dark:hover:text-cyan-300"
                >
                  <svg
                    class="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                  +880 1700-000000
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/8801700000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-3 transition hover:text-green-600 dark:hover:text-green-400"
                >
                  <svg
                    class="h-4 w-4 shrink-0 text-green-600 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                    />
                  </svg>
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div
          class="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-600 dark:border-slate-700/40 dark:text-slate-500 sm:flex-row"
        >
          <p>&copy; {{ new Date().getFullYear() }} Protesk. All rights reserved.</p>
          <p class="flex items-center gap-2">
            <svg
              class="h-4 w-4 text-cyan-600 dark:text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Secure payments powered by
            <span class="font-semibold text-cyan-600 dark:text-cyan-400">Stripe</span>
          </p>
        </div>
      </div>
    </footer>

    <!-- ✅ Support Chat Widget (shob page e dekhabe) -->
    <SupportChatWidget />
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from 'nuxt/app';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useCartStore } from '../../stores/cart';
import { useWishlistStore } from '../../stores/Wishlist';
import { useSupportChat } from '../composables/useSupportchat';

const route = useRoute();
const auth = useAuthStore();
const cart = useCartStore();
const wishlist = useWishlistStore();
const { open: openSupportChat } = useSupportChat();

const mobileOpen = ref(false);
const searchQuery = ref('');

const categories = ['Audio', 'Wearables', 'Accessories', 'Cameras'];

const isShop = computed(() => route.path === '/');
const isAuthenticated = computed(() => auth.isAuthenticated);

const goSearch = () => {
  const q = searchQuery.value.trim();
  if (!q) return;
  navigateTo({ path: '/search', query: { q } });
  searchQuery.value = '';
  mobileOpen.value = false;
};

const handleLogout = async () => {
  mobileOpen.value = false;
  await auth.logout();
  await navigateTo('/login');
};
</script>
