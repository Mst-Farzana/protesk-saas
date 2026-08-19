<template>
  <div class="bg-white dark:bg-slate-950">
    <!-- Hero -->
    <section
      class="relative overflow-hidden bg-white py-16 text-black dark:bg-gradient-to-br dark:from-[#071630] dark:via-[#0a2242] dark:to-[#0e2f5a] dark:text-white"
    >
      <div
        class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/20"
      />
      <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <span
          class="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-xs font-medium text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-300"
        >
          💬 We're here to help
        </span>
        <h1 class="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
          Contact Us
        </h1>
        <p class="mx-auto mt-3 max-w-xl text-sm text-slate-600 sm:text-base dark:text-slate-300">
          Questions about an order or a product? Our team usually replies within 24 hours.
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div class="grid gap-10 lg:grid-cols-5">
        <!-- Info Cards -->
        <div class="space-y-4 lg:col-span-2">
          <a
            v-for="c in contactCards"
            :key="c.title"
            :href="c.href"
            :target="c.external ? '_blank' : undefined"
            rel="noopener noreferrer"
            class="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-500 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-400"
          >
            <div
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="c.icon" />
              </svg>
            </div>
            <div>
              <p class="font-semibold text-slate-900 dark:text-white">{{ c.title }}</p>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ c.sub }}</p>
            </div>
          </a>

          <div
            class="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <p class="font-semibold text-slate-900 dark:text-white">Business Hours</p>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Saturday – Thursday: 9:00 AM – 8:00 PM
            </p>
            <p class="text-sm text-slate-500 dark:text-slate-400">Friday: Closed</p>
          </div>
        </div>

        <!-- Form -->
        <form
          class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8 lg:col-span-3"
          @submit.prevent="submit"
        >
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">Send us a message</h2>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Fill out the form below and we'll get back to you shortly.
          </p>

          <div class="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300"
                >Your Name</label
              >
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="John Doe"
                class="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
              />
            </div>
            <div>
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300"
                >Email Address</label
              >
              <input
                v-model="form.email"
                type="email"
                required
                placeholder="you@example.com"
                class="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
              />
            </div>
          </div>

          <div class="mt-5">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Subject</label>
            <input
              v-model="form.subject"
              type="text"
              required
              placeholder="Order inquiry"
              class="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
            />
          </div>

          <div class="mt-5">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
            <textarea
              v-model="form.message"
              required
              rows="5"
              placeholder="Write your message..."
              class="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
            />
          </div>

          <div
            v-if="sent"
            class="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700 dark:border-green-900/50 dark:bg-green-900/10 dark:text-green-400"
          >
            ✅ Message sent successfully! We'll reply within 24 hours.
          </div>
          <div
            v-if="sendError"
            class="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-400"
          >
            {{ sendError }}
          </div>

          <button
            type="submit"
            :disabled="sending"
            class="mt-6 rounded-full bg-cyan-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ sending ? 'Sending...' : 'Send Message' }}
          </button>
        </form>
      </div>

      <!-- FAQ -->
      <div class="mx-auto mt-20 max-w-3xl">
        <h2 class="text-center text-2xl font-bold text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <div class="mt-8 space-y-3">
          <div
            v-for="(f, i) in faqs"
            :key="f.q"
            class="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          >
            <button
              type="button"
              class="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white"
              @click="openFaq = openFaq === i ? null : i"
            >
              {{ f.q }}
              <svg
                class="h-4 w-4 shrink-0 text-cyan-600 transition dark:text-cyan-400"
                :class="openFaq === i ? 'rotate-180' : ''"
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
            <p
              v-if="openFaq === i"
              class="border-t border-slate-100 px-6 py-4 text-sm leading-6 text-slate-500 dark:border-slate-800 dark:text-slate-400"
            >
              {{ f.a }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Contact Us | Protesk' });

const form = reactive({ name: '', email: '', subject: '', message: '' });
const sending = ref(false);
const sent = ref(false);
const sendError = ref('');
const openFaq = ref<number | null>(0);

const submit = async () => {
  sending.value = true;
  sent.value = false;
  sendError.value = '';
  try {
    await $fetch('/api/contact', { method: 'POST', body: { ...form } });
    sent.value = true;
    form.name = '';
    form.email = '';
    form.subject = '';
    form.message = '';
  } catch {
    sendError.value = 'Something went wrong. Please try again or email us directly.';
  } finally {
    sending.value = false;
  }
};

const contactCards = [
  {
    title: 'Email Us',
    sub: 'support@protesk.com',
    href: 'mailto:support@protesk.com',
    external: false,
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    title: 'Call Us',
    sub: '+880 1700-000000',
    href: 'tel:+8801700000000',
    external: false,
    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  },
  {
    title: 'WhatsApp',
    sub: 'Chat with us instantly',
    href: 'https://wa.me/8801700000000',
    external: true,
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  },
  {
    title: 'Visit Us',
    sub: 'Dhaka, Bangladesh',
    href: '#',
    external: false,
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z',
  },
];

const faqs = [
  {
    q: 'How long does delivery take?',
    a: 'Inside Dhaka we deliver within 24–48 hours. Outside Dhaka it usually takes 2–4 working days depending on your location.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit/debit cards through our secure Stripe-powered checkout. Your payment details are fully encrypted.',
  },
  {
    q: 'What is your return policy?',
    a: 'You can return any product within 7 days of delivery if it is unused and in original packaging. Refunds are processed within 5–7 business days.',
  },
  {
    q: 'How do I track my order?',
    a: 'Go to the "Track Order" page and enter your Order ID (you receive it in your confirmation email after checkout).',
  },
];
</script>
