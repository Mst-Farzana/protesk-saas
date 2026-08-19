<template>
  <div class="bg-white dark:bg-slate-950">
    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
        Account Settings
      </h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Manage your profile, security and preferences
      </p>

      <div class="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <!-- ✅ Left Sidebar -->
        <aside class="space-y-6">
          <!-- Profile Mini Card -->
          <div
            class="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div class="relative mx-auto h-20 w-20">
              <img
                v-if="avatarUrl"
                :src="avatarUrl"
                alt="Avatar"
                class="h-20 w-20 rounded-full object-cover ring-4 ring-cyan-500/30"
              />
              <div
                v-else
                class="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-3xl font-bold text-white"
              >
                {{ initial }}
              </div>
              <label
                for="avatar-input"
                class="absolute -bottom-1 -right-1 cursor-pointer rounded-full bg-cyan-600 p-1.5 text-white shadow transition hover:bg-cyan-500"
                :title="uploading ? 'Uploading...' : 'Change photo'"
              >
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </label>
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                class="hidden"
                @change="onAvatarChange"
              />
            </div>
            <h2 class="mt-4 truncate text-lg font-semibold text-slate-900 dark:text-white">
              {{ displayName }}
            </h2>
            <p class="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
              {{ user?.email }}
            </p>
          </div>

          <!-- Nav -->
          <nav
            class="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:flex-col"
          >
            <button
              v-for="t in tabs"
              :key="t.id"
              type="button"
              class="flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition"
              :class="
                activeTab === t.id
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              "
              @click="activeTab = t.id"
            >
              <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="t.icon" />
              </svg>
              {{ t.label }}
            </button>

            <button
              type="button"
              class="flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/20"
              @click="handleLogout"
            >
              <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </nav>
        </aside>

        <!-- ✅ Right Content -->
        <div class="space-y-6">
          <!-- Notice -->
          <div
            v-if="notice.text"
            class="rounded-xl border p-4 text-sm font-medium"
            :class="
              notice.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-900/10 dark:text-green-400'
                : 'border-red-200 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-400'
            "
          >
            {{ notice.text }}
          </div>

          <!-- ✅ Profile -->
          <section
            v-if="activeTab === 'profile'"
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
          >
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Public Profile</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              This information will be visible on your orders and reviews.
            </p>

            <div class="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Display Name
                </label>
                <input
                  v-model="profile.name"
                  type="text"
                  placeholder="Your name"
                  class="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Phone
                </label>
                <input
                  v-model="profile.phone"
                  type="tel"
                  placeholder="+880 1XXX-XXXXXX"
                  class="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div class="mt-5">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                Email (read-only)
              </label>
              <input
                :value="user?.email"
                type="email"
                disabled
                class="mt-2 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400"
              />
            </div>

            <button
              type="button"
              :disabled="saving"
              class="mt-6 rounded-full bg-cyan-600 px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:opacity-60"
              @click="saveProfile"
            >
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </section>

          <!-- ✅ Security -->
          <section
            v-else-if="activeTab === 'security'"
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
          >
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Change Password</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Use at least 6 characters with a mix of letters and numbers.
            </p>

            <div class="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                  New Password
                </label>
                <input
                  v-model="pass.next"
                  type="password"
                  placeholder="••••••••"
                  class="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Confirm Password
                </label>
                <input
                  v-model="pass.confirm"
                  type="password"
                  placeholder="••••••••"
                  class="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <button
              type="button"
              :disabled="changing"
              class="mt-6 rounded-full bg-cyan-600 px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:opacity-60"
              @click="changePassword"
            >
              {{ changing ? 'Updating...' : 'Update Password' }}
            </button>
          </section>

          <!-- ✅ Preferences -->
          <section v-else-if="activeTab === 'preferences'" class="space-y-6">
            <!-- Appearance -->
            <div
              class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
            >
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Appearance</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Choose how Protesk looks for you.
              </p>
              <div class="mt-5 grid grid-cols-3 gap-3">
                <button
                  v-for="m in modes"
                  :key="m.value"
                  type="button"
                  class="rounded-xl border p-4 text-center text-sm font-medium transition"
                  :class="
                    colorMode.preference === m.value
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300'
                      : 'border-slate-200 text-slate-600 hover:border-cyan-400 dark:border-slate-700 dark:text-slate-300'
                  "
                  @click="colorMode.preference = m.value"
                >
                  {{ m.label }}
                </button>
              </div>
            </div>

            <!-- Language (✅ Clean — no duplicate wrapper) -->
            <div
              class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
            >
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Language</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Your preferred language for the store.
              </p>
              <select
                :value="lang"
                class="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                @change="setLang(($event.target as HTMLSelectElement).value)"
              >
                <option value="en">English</option>
                <option value="bn">বাংলা (Bangla)</option>
              </select>
            </div>
          </section>

          <!-- ✅ Orders -->
          <section
            v-else
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
          >
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Orders & Activity</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Quick access to your shopping activity.
            </p>
            <div class="mt-5 grid gap-3 sm:grid-cols-3">
              <NuxtLink
                v-for="l in links"
                :key="l.to"
                :to="l.to"
                class="rounded-xl border border-slate-200 p-4 text-sm font-medium text-slate-700 transition hover:border-cyan-500 hover:bg-cyan-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:bg-cyan-900/20"
              >
                {{ l.label }} →
              </NuxtLink>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../stores/auth';

useHead({ title: 'Account Settings | Protesk' });

const auth = useAuthStore();
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const colorMode = useColorMode();
const { lang, setLang } = useSiteLang();

if (!user.value) await navigateTo('/login', { replace: true });

const activeTab = ref('profile');
const notice = reactive({ type: '' as 'success' | 'error' | '', text: '' });
const flash = (type: 'success' | 'error', text: string) => {
  notice.type = type;
  notice.text = text;
  setTimeout(() => (notice.text = ''), 4000);
};

// ✅ Profile
const meta = (user.value?.user_metadata ?? {}) as any;
const profile = reactive({ name: meta.name ?? '', phone: meta.phone ?? '' });
const saving = ref(false);

const displayName = computed(
  () => profile.name || (user.value?.email ? user.value.email.split('@')[0] : 'User')
);
const initial = computed(() => displayName.value.charAt(0).toUpperCase());
const avatarUrl = computed(() => (user.value?.user_metadata as any)?.avatar_url ?? '');

const saveProfile = async () => {
  saving.value = true;
  try {
    const { error } = await supabase.auth.updateUser({
      data: { name: profile.name, phone: profile.phone },
    });
    if (error) throw error;
    flash('success', 'Profile updated successfully!');
  } catch {
    flash('error', 'Could not update profile. Try again.');
  } finally {
    saving.value = false;
  }
};

// ✅ Avatar Upload (Supabase Storage)
const uploading = ref(false);
const onAvatarChange = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  uploading.value = true;
  try {
    const path = `${user.value!.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    const { error: metaErr } = await supabase.auth.updateUser({
      data: { avatar_url: data.publicUrl },
    });
    if (metaErr) throw metaErr;
    flash('success', 'Profile photo updated!');
  } catch {
    flash(
      'error',
      'Upload failed. Make sure an "avatars" bucket (public) exists in Supabase Storage.'
    );
  } finally {
    uploading.value = false;
    input.value = '';
  }
};

// ✅ Password
const pass = reactive({ next: '', confirm: '' });
const changing = ref(false);
const changePassword = async () => {
  if (pass.next.length < 6) return flash('error', 'Password must be at least 6 characters.');
  if (pass.next !== pass.confirm) return flash('error', 'Passwords do not match.');
  changing.value = true;
  try {
    const { error } = await supabase.auth.updateUser({ password: pass.next });
    if (error) throw error;
    pass.next = '';
    pass.confirm = '';
    flash('success', 'Password changed successfully!');
  } catch {
    flash('error', 'Could not change password. Try again.');
  } finally {
    changing.value = false;
  }
};

// ✅ UI Data
const modes = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
];

// ✅ Fixed: Track Orders link
const links = [
  { label: 'Track Orders', to: '/products/track-order' },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Cart', to: '/cart' },
];

const tabs = [
  {
    id: 'profile',
    label: 'Profile',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    id: 'security',
    label: 'Password & Security',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  },
  {
    id: 'preferences',
    label: 'Language & Theme',
    icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
  },
  {
    id: 'orders',
    label: 'Orders & Activity',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  },
];

const handleLogout = async () => {
  await auth.logout();
  await navigateTo('/login');
};
</script>
