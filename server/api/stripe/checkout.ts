// server/api/stripe/checkout.post.ts
import { createError, defineEventHandler, readBody } from 'h3';
import Stripe from 'stripe';
import { prisma } from '../../utils/prisma';

interface CartItem {
  id: string;
  name: string;
  price: number | string; // ✅ Frontend string pathate pare
  quantity: number | string;
  imageUrl?: string;
  productId?: string;
}

interface CheckoutBody {
  items: CartItem[];
  userId?: string;
}

export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const stripeSecretKey = config.stripeSecretKey;

  if (!stripeSecretKey) {
    console.error('❌ STRIPE_SECRET_KEY is not set in .env file!');
    throw createError({
      statusCode: 500,
      statusMessage: 'Stripe configuration error',
    });
  }

  const stripe = new Stripe(stripeSecretKey);
  const body = await readBody<CheckoutBody>(event);
  const { items, userId } = body;

  // ✅ Cart validation
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cart is empty or invalid',
    });
  }

  // ✅ Line items build
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const item of items) {
    // 🔧 Fix: Frontend string pathale o Number e convert hobe
    const price = Number(item.price);

    if (!item.name || !Number.isFinite(price) || price <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid item: ${item.name || 'unknown'} (price received: ${item.price})`,
      });
    }

    const productId = item.productId || item.id || '';
    const quantity = Math.max(1, Number(item.quantity) || 1);

    // ✅ DB থেকে latest price verify (যদি productId থাকে)
    let finalPrice = price;
    if (productId) {
      const dbProduct = await prisma.product
        .findUnique({ where: { id: productId } })
        .catch(() => null);

      if (dbProduct) {
        finalPrice = Number(dbProduct.price);
      }
    }

    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          // 🔧 Fix: Stripe sudhu absolute URL (http/https) accept kore. Relative path ignore kora holo.
          images: item.imageUrl && item.imageUrl.startsWith('http') ? [item.imageUrl] : [],
          metadata: {
            productId: productId,
          },
        },
        unit_amount: Math.round(finalPrice * 100),
      },
      quantity,
    });
  }

  if (!lineItems.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No valid items in cart',
    });
  }

  const siteUrl = config.public.siteUrl || 'http://localhost:3000';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${siteUrl}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/?canceled=true`,
      metadata: {
        userId: userId && userId !== 'guest-user' ? userId : 'guest',
      },
    });

    console.log('✅ Stripe session created:', session.id);
    return { url: session.url };
  } catch (error: any) {
    console.error('❌ Stripe Error:', error.message);
    throw createError({
      statusCode: 500,
      statusMessage: `Payment failed: ${error.message}`,
    });
  }
});
