// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2025-06-14',

  // ✅ Nuxt 4 future compatibility
  future: {
    compatibilityVersion: 4,
  },

  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    [
      '@nuxtjs/color-mode',
      {
        preference: 'system',
        dataValue: 'theme',
        classSuffix: '',
      },
    ],
    '@nuxtjs/supabase',
    '@nuxtjs/seo',
    '@nuxtjs/sitemap',
    '@nuxtjs/eslint-module',
    '@nuxt/image',
  ],

  // i18n: {
  //   langDir: 'locales',
  //   defaultLocale: 'en',
  //   strategy: 'prefix_except_default',
  //   locales: [
  //     { code: 'en', name: 'English', file: 'en.json' },
  //     { code: 'bn', name: 'বাংলা', file: 'bn.json' },
  //   ],
  //   detectBrowserLanguage: {
  //     useCookie: true,
  //     cookieKey: 'i18n_lang',
  //     fallbackLocale: 'en',
  //   },
  // },

  image: {
    provider: 'ipx',
    format: ['webp', 'avif'],
    quality: 80,

    domains: [
      'picsum.photos',
      'images.unsplash.com',
      'images.pexels.com',
      'cjblmtxmhcrqamjjaxke.supabase.co',
      'localhost',
    ],
  },

  site: {
    url: 'https://protesk.com',
    name: 'Protesk SaaS',
    description: 'Modern E-commerce Admin Panel built with Nuxt 4, Supabase, and Prisma',
    defaultLocale: 'en',
  },

  // ✅ Dynamic sitemap (hard-coded IDs remove)
  sitemap: {
    enabled: true,
    exclude: ['/admin/**', '/login', '/register', '/confirm', '/api/**'],
    urls: async () => {
      // Dynamic product URLs
      const { prisma } = await import('./server/utils/prisma');
      const products: { id: string; updatedAt: Date }[] = await prisma.product
        .findMany({ select: { id: true, updatedAt: true } })
        .catch(() => [] as { id: string; updatedAt: Date }[]);

      return [
        { loc: '/', lastmod: new Date(), changefreq: 'weekly' as const, priority: 1 as const },
        {
          loc: '/cart',
          lastmod: new Date(),
          changefreq: 'monthly' as const,
          priority: 0.5 as const,
        },
        {
          loc: '/checkout',
          lastmod: new Date(),
          changefreq: 'monthly' as const,
          priority: 0.6 as const,
        },
        {
          loc: '/about',
          lastmod: new Date(),
          changefreq: 'monthly' as const,
          priority: 0.7 as const,
        },
        {
          loc: '/contact',
          lastmod: new Date(),
          changefreq: 'monthly' as const,
          priority: 0.6 as const,
        },
        // ✅ Dynamic product pages
        ...products.map(p => ({
          loc: `/products/${p.id}`,
          lastmod: p.updatedAt,
          changefreq: 'daily' as const,
          priority: 0.8 as const,
        })),
      ];
    },
  },

  ogImage: {
    zeroRuntime: true,
  },

  robots: {
    disallow: ['/admin', '/login', '/register', '/api'],
    allow: ['/', '/products/**', '/cart', '/checkout', '/about', '/contact'],
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Protesk',
      url: 'https://protesk.com',
      logo: 'https://protesk.com/logo.png',
    },
  },

  eslint: {
    lintOnStart: false,
  },

  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      include: undefined,
      exclude: ['/register', '/login', '/'],
      cookieRedirect: false,
    },
  },

  runtimeConfig: {
    supabaseSecretKey: process.env.NUXT_SUPABASE_SECRET_KEY || '',
    stripeSecretKey: process.env.NUXT_STRIPE_SECRET_KEY || '',
    stripeWebhookSecret: process.env.NUXT_STRIPE_WEBHOOK_SECRET || '',

    // OpenAI - SERVER ONLY
    openaiApiKey: process.env.NUXT_OPENAI_API_KEY || process.env.OPENAI_API_KEY || '',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    geminiModel: process.env.GEMINI_MODEL || 'gemini-3.6-flash',

    resendApiKey: process.env.NUXT_RESEND_API_KEY || '',

    public: {
      stripePublishableKey: process.env.NUXT_STRIPE_PUBLISHABLE_KEY || '',

      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },
  // ✅ Route-level caching & optimization
  routeRules: {
    '/api/products': { swr: 60 }, // Cache 60s, stale-while-revalidate
    '/api/chat': { cache: false }, // No cache (AI responses)
    '/products/**': { swr: 300 }, // Product pages cached 5min
    '/admin/**': { ssr: false }, // Admin is SPA
  },

  app: {
    head: {
      title: 'Protesk - Modern E-commerce Store',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Shop electronics, accessories with confidence. Modern e-commerce with FinTech-ready admin panel.',
        },
        { name: 'theme-color', content: '#06b6d4' }, // Cyan to match design
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Protesk SaaS' },
        { property: 'og:title', content: 'Protesk - Modern E-commerce Store' },
        { property: 'og:description', content: 'Shop with confidence. FinTech-ready admin panel.' },
        { property: 'og:image', content: 'https://protesk.com/__og-image__/image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:url', content: 'https://protesk.com' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Protesk Store' },
        { name: 'twitter:description', content: 'Modern E-commerce, FinTech-Ready' },
        { name: 'twitter:image', content: 'https://protesk.com/__og-image__/image.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/Favicon.png' }, // ✅ png instead of ico
        { rel: 'canonical', href: 'https://protesk.com' },
        { rel: 'preconnect', href: 'https://images.unsplash.com' },
        { rel: 'dns-prefetch', href: 'https://images.unsplash.com' },
        { rel: 'preconnect', href: 'https://picsum.photos' },
      ],
    },
  },

  nitro: {
    compressPublicAssets: true,
    // ✅ Security headers
    routeRules: {
      '/**': {
        headers: {
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
      },
    },
    // ✅ Prisma optimization
    esbuild: {
      options: {
        target: 'es2022',
      },
    },
  },

  // ✅ Vite optimizations
  vite: {
    build: {
      target: 'es2022',
      cssMinify: true,
    },
    optimizeDeps: {
      include: ['vue', '@vue/runtime-dom'],
    },
  },

  // ✅ Experimental features (Nuxt 4)
  experimental: {
    typedPages: true,
    inlineRouteRules: true,
    viewTransition: true,
  },

  typescript: {
    strict: true,
    typeCheck: 'build', // ✅ Type check on build
  },
});
