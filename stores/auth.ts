import { useSupabaseClient } from '#imports';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  role: 'CUSTOMER' | 'ADMIN' | 'MERCHANT';
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null);
  const isAuthenticated = computed(() => user.value !== null);
  const isAdmin = computed(() => user.value?.role === 'ADMIN');

  const setUser = (next: AuthUser | null) => {
    user.value = next;
  };

  const clearUser = () => {
    user.value = null;
  };

  const hydrate = async () => {
    const supabase = useSupabaseClient();

    try {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        user.value = null;
        return;
      }

      user.value = {
        id: data.user.id,
        email: data.user.email ?? '',
        name: data.user.user_metadata?.full_name ?? data.user.user_metadata?.name ?? null,
        role: (data.user.user_metadata?.role ?? 'CUSTOMER') as AuthUser['role'],
      };
    } catch (error) {
      console.error('Failed to hydrate auth state:', error);
      user.value = null;
    }
  };

  const logout = async () => {
    const supabase = useSupabaseClient();

    try {
      await supabase.auth.signOut();
    } finally {
      user.value = null;
    }
  };

  return {
    user,
    isAuthenticated,
    isAdmin,
    setUser,
    clearUser,
    hydrate,
    logout,
  };
});
