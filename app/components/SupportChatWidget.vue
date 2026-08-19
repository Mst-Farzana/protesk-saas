<template>
  <div>
    <!-- Floating Button -->
    <button
      v-if="!isOpen"
      type="button"
      aria-label="Open support chat"
      class="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-xl transition hover:scale-110 hover:shadow-2xl"
      @click="open"
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
      <!-- Pulse ring -->
      <span class="absolute inset-0 animate-ping rounded-full bg-cyan-400 opacity-20" />
    </button>

    <!-- Chat Window -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-4 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-4 opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed bottom-6 right-6 z-50 flex h-[32rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3 text-white"
        >
          <div class="flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm font-semibold">AI Support</p>
              <p class="text-xs text-cyan-100">Online • Replies instantly</p>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button
              v-if="messages.length > 0"
              type="button"
              aria-label="Reset conversation"
              class="rounded-full p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
              @click="handleReset"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Close chat"
              class="rounded-full p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
              @click="close"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <!-- Messages -->
        <div ref="messagesEl" class="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          <!-- Welcome message -->
          <div v-if="messages.length === 0" class="text-center">
            <div
              class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-50 dark:bg-cyan-900/20"
            >
              <svg
                class="h-6 w-6 text-cyan-600 dark:text-cyan-400"
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
            </div>
            <p class="text-sm font-semibold text-slate-900 dark:text-white">Hi there! 👋</p>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Ask me anything about orders, products, or shipping.
            </p>
            <div class="mt-4 space-y-2">
              <button
                v-for="suggestion in suggestions"
                :key="suggestion"
                type="button"
                class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs text-slate-700 transition hover:border-cyan-400 hover:bg-cyan-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-cyan-500 dark:hover:bg-cyan-900/20"
                @click="sendSuggestion(suggestion)"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>

          <!-- Message list -->
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="flex"
            :class="msg.role === 'USER' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[80%] rounded-2xl px-3.5 py-2 text-sm"
              :class="
                msg.role === 'USER'
                  ? 'rounded-br-sm bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                  : 'rounded-bl-sm bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
              "
            >
              <p class="whitespace-pre-wrap">{{ msg.content }}</p>
              <p
                class="mt-1 text-[10px]"
                :class="
                  msg.role === 'USER' ? 'text-cyan-100' : 'text-slate-400 dark:text-slate-500'
                "
              >
                {{ formatTime(msg.timestamp) }}
              </p>
            </div>
          </div>

          <!-- Typing indicator -->
          <div v-if="isTyping" class="flex justify-start">
            <div class="rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3 dark:bg-slate-800">
              <div class="flex gap-1">
                <span
                  class="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                  style="animation-delay: 0ms"
                />
                <span
                  class="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                  style="animation-delay: 150ms"
                />
                <span
                  class="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                  style="animation-delay: 300ms"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Input -->
        <form
          class="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-900"
          @submit.prevent="handleSubmit"
        >
          <input
            v-model="draft"
            type="text"
            placeholder="Type your message..."
            :disabled="isTyping"
            class="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-cyan-400"
          />
          <button
            type="submit"
            :disabled="!draft.trim() || isTyping"
            class="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-600 text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-cyan-500 dark:hover:bg-cyan-400"
            aria-label="Send message"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

const { isOpen, messages, isTyping, open, close, send, reset } = useSupportChat();

const draft = ref('');
const messagesEl = ref<HTMLElement | null>(null);

const suggestions = [
  'Where is my order?',
  'How do I request a refund?',
  'What are your shipping times?',
  'Do you ship internationally?',
];

const handleSubmit = async () => {
  const text = draft.value.trim();
  if (!text || isTyping.value) return;
  draft.value = '';
  await send(text);
};

const sendSuggestion = async (text: string) => {
  if (isTyping.value) return;
  await send(text);
};

const handleReset = () => {
  if (confirm('Clear conversation history?')) {
    reset();
  }
};

const formatTime = (ts: number) => {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// ✅ Auto-scroll when new message arrives
watch(
  () => messages.value.length,
  async () => {
    await nextTick();
    if (messagesEl.value) {
      messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
    }
  }
);
</script>
