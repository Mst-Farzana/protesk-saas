# Protesk SaaS

This project is a Nuxt-based e-commerce platform with a modern storefront, admin panel, Stripe checkout, and an AI-powered shopping assistant.

## AI-native architecture

The app now keeps its current e-commerce and admin flows intact while adding an AI layer in three places:

- `app/pages/index.vue` - storefront AI assistant UI
- `server/api/ai/recommendations.post.ts` - AI recommendation endpoint
- `server/utils/ai.js` - OpenAI integration with safe fallback logic

This means the project remains fully functional even when OpenAI is not configured, and it automatically switches to rule-based recommendations.

## Environment variables

Create a `.env` file with:

```bash
OPENAI_API_KEY=your_openai_api_key

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NUXT_SUPABASE_SECRET_KEY=your_supabase_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
SITE_URL=http://localhost:3000
```

## Local development

```bash
pnpm install
pnpm dev
```

## Production build

```bash
pnpm build
pnpm preview
```

## AI usage flow

1. User writes a shopping prompt like “best value under $250”
2. The frontend sends the prompt to `/api/ai/recommendations`
3. The server queries the product catalog and asks OpenAI for ranked suggestions
4. If OpenAI is unavailable, the project falls back to local recommendation logic
5. The user can add any recommended item directly to cart
