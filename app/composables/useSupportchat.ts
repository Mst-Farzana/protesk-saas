// composables/useSupportChat.ts
import { onMounted, readonly, useState } from '#imports';

interface ChatMessage {
  id: string;
  role: 'USER' | 'AI';
  content: string;
  timestamp: number;
}

const STORAGE_KEY = 'protesk_support_conversation';

export const useSupportChat = () => {
  // ✅ Global state — সব পেজ থেকে অ্যাক্সেস করা যাবে
  const isOpen = useState('support-chat-open', () => false);
  const conversationId = useState<string | null>('support-chat-cid', () => null);
  const messages = useState<ChatMessage[]>('support-chat-messages', () => []);
  const isTyping = useState('support-chat-typing', () => false);

  // ✅ LocalStorage থেকে পুরনো conversation load
  onMounted(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.conversationId && Array.isArray(data.messages)) {
          conversationId.value = data.conversationId;
          messages.value = data.messages;
        }
      }
    } catch (e) {
      console.warn('Failed to load support chat history', e);
    }
  });

  // ✅ Save to localStorage on change
  const persist = () => {
    try {
      if (conversationId.value) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            conversationId: conversationId.value,
            messages: messages.value.slice(-50), // Only keep last 50
          })
        );
      }
    } catch (e) {
      // Ignore quota errors
    }
  };

  const open = () => {
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
  };

  const toggle = () => {
    isOpen.value = !isOpen.value;
  };

  const reset = () => {
    conversationId.value = null;
    messages.value = [];
    localStorage.removeItem(STORAGE_KEY);
  };

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || isTyping.value) return;

    // ✅ ১. User message add (Immutable way - Reactivity নিশ্চিত করতে)
    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'USER',
      content,
      timestamp: Date.now(),
    };
    messages.value = [...messages.value, userMsg]; // ✅ .push() এর বদলে এটি
    isTyping.value = true;
    persist();

    try {
      const res: any = await $fetch('/api/support/chat', {
        method: 'POST',
        body: {
          message: content,
          conversationId: conversationId.value,
        },
      });

      // ✅ ২. Save conversationId for future messages
      if (res.conversationId && !conversationId.value) {
        conversationId.value = res.conversationId;
      }

      // ✅ ৩. AI response add (Immutable way)
      const aiMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        role: 'AI',
        content: res.message || 'Sorry, no response received.',
        timestamp: Date.now(),
      };
      messages.value = [...messages.value, aiMsg]; // ✅ .push() এর বদলে এটি
    } catch (err: any) {
      // ✅ ৪. Error message add (Immutable way)
      messages.value = [
        ...messages.value,
        {
          id: `e_${Date.now()}`,
          role: 'AI',
          content: err?.data?.statusMessage || '⚠️ Failed to connect. Please try again later.',
          timestamp: Date.now(),
        },
      ];
    } finally {
      isTyping.value = false;
      persist();
    }
  };

  return {
    isOpen: readonly(isOpen),
    conversationId: readonly(conversationId),
    messages: readonly(messages),
    isTyping: readonly(isTyping),
    open,
    close,
    toggle,
    reset,
    send,
  };
};
